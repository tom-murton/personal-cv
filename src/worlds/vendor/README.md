# Vendored world modules

Copies of the sibling sites' hero loops, mounted by tommurton.com as worlds. Each folder is a byte-for-byte
copy (except `lightscout/places.json`, below) of the files named in `SOURCES.json`, with the source repository, path and commit (or, for files not yet
committed by their builder, the working-copy SHA-256 and the time it was copied). Do not edit these files:
re-copy them from their source. The adapters in `src/stage/worlds/` are the only code that touches them.

`lightscout/places.json` is the one exception: it is derived, not copied. It holds the `.place` links from
`public/landing.html` in the LightScout site (the `data-*` attributes, with relative URLs made absolute to
`https://www.lightscout.app`). Its `sha256` in `SOURCES.json` is the hash of this derived file, not of the source.

## Re-vendoring

There is no script; the procedure the history shows (commit `494ba10`) is manual:

1. Fetch each source repository in `~/GitHub` (TachoClear in `tachoclear`, CutRoof in `cutroof`, PAT Logbook in
   `patbook-site`, Rest+Rise in `restrise-site`, LightScout in `Lightscout-site`). Level Best and WeEvolve both
   come from `weevolve-site`, under `src/loop/`.
2. For each entry in `SOURCES.json`, for each file: `git -C <source repo> show origin/main:<path> > src/worlds/vendor/<folder>/<copiedTo>`.
   Where an entry points at a pull-request branch (`ref`), use `origin/main` once that has merged.
3. Update the entry's `ref`, `commit` (`git rev-parse origin/main`), `copied` and each file's `sha256`
   (`shasum -a 256`) and `lastChangedIn` (`git log -1 --format=%H -- <path>`).
4. Regenerate `lightscout/places.json` from the `.place` elements of `public/landing.html` if the guide places
   changed; no extraction script is checked in.
5. Never edit the vendored files. Run `npm run build`, check each affected world at `?w=<slug>&static=1`, and
   re-check its adapter in `src/stage/worlds/` if the module's API changed.
