// site-generator-speed-01-v1: the program the harness runs (node /bot/main.ts, node22).
// It reads every case from /input/cases.json (a JSON array of {id, input}),
// answers each one alone with run() from solve.js, and writes
// /output/answers.json: a JSON array of the answers, one per case and in the
// cases' order. Outside a container MAKEFUN_INPUT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /input and /output.

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { setFlagsFromString } from 'node:v8';

// V8's incremental marking off, set before solve.js is imported so all of its work runs under it (the rules: the house
// baseline runs with --no-incremental-marking, and an entry may tune V8's flags too).
setFlagsFromString('--no-incremental-marking');

/** solve.js, imported by its URL (a .js module carries no types) and typed by its contract. */
const { run } = (await import(new URL('./solve.js', import.meta.url).href)) as { run: (input: unknown) => unknown };

const INPUT_DIR = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

/**
 * Serialise the answers. Every answer is an output tree: a flat object of
 * path -> text, all strings. Serialising those incrementally (one native
 * JSON.stringify per string, joined once) is byte-identical to
 * JSON.stringify(answers) and measurably faster on ~7 MB of HTML. Anything
 * else falls back to JSON.stringify, so the output is exact whatever run()
 * returns.
 */
function stringifyAnswers(answers: unknown[]): string {
  for (const a of answers) {
    if (a === null || typeof a !== 'object' || Array.isArray(a)) return JSON.stringify(answers);
    for (const v of Object.values(a as Record<string, unknown>)) {
      if (typeof v !== 'string') return JSON.stringify(answers);
    }
  }
  const parts: string[] = ['['];
  for (let ci = 0; ci < answers.length; ci++) {
    if (ci !== 0) parts.push(',');
    parts.push('{');
    const obj = answers[ci] as Record<string, string>;
    let first = true;
    for (const k of Object.keys(obj)) {
      if (!first) parts.push(',');
      first = false;
      parts.push(JSON.stringify(k), ':', JSON.stringify(obj[k]));
    }
    parts.push('}');
  }
  parts.push(']');
  return parts.join('');
}

const cases = JSON.parse(readFileSync(join(INPUT_DIR, 'cases.json'), 'utf8')) as { id: string; input: unknown }[];
const answers: unknown[] = [];
for (const c of cases) answers.push(run(c.input));
writeFileSync(join(OUTPUT_DIR, 'answers.json'), stringifyAnswers(answers));
