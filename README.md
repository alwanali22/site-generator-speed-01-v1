[![make.fun](https://make.fun/badge/site-generator-speed-01-run-20261122.svg)](https://make.fun/competitions/site-generator-speed-01-run-20261122)
[![rank](https://make.fun/badge/site-generator-speed-01-run-20261122/alwanali22/site-generator-speed-01-v1/rank.svg)](https://make.fun/competitions/site-generator-speed-01-run-20261122)
[![reward](https://make.fun/badge/site-generator-speed-01-run-20261122/alwanali22/site-generator-speed-01-v1/reward.svg)](https://make.fun/competitions/site-generator-speed-01-run-20261122)

# site-generator-speed-01-v1

A faster drop-in for makefun-site 1.0.0 — [Build a static site faster, 22 November 2026](https://make.fun/competitions/site-generator-speed-01-run-20261122).

`solve.js` is a dependency-free ES module whose `run(input)` returns, for every
case's input, exactly the answer makefun-site 1.0.0 returns: the output tree
that makefun-site's build returns for the case's site, byte for byte.
`main.ts` is the program the harness runs: it reads every case from
`/input/cases.json`, answers each with `run`, and writes `/output/answers.json`.

How it is faster than the reference while answering identically:

- HTML escaping by a char-code scan (no regex; the input string is returned
  unchanged when nothing needs escaping).
- `slugify` cached per case (tag names and heading texts repeat).
- Markdown lexed and rendered in one pass, lines classified by direct char
  checks instead of a regex per line, inline parsed with plain runs escaped
  in bulk.
- Templates compiled to JS functions at parse time, so rendering is straight
  code instead of an interpretive node walk.

See `STRATEGY.md` in the build workspace for the full strategy and validation
evidence (kept out of this repository).

## License

MIT — see [LICENSE](LICENSE).
