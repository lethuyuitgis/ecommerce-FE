# Dev Build Performance Tips

The local dev server was spending 6–7 seconds on every Fast Refresh.  
Here are the changes already applied and how to get the most out of them.

## 1. Webpack tweaks only run in production
- The custom `splitChunks` config is now gated behind `!dev`, so development rebuilds keep the default fast settings.
- This removes the long “rebuilding…” pauses during local coding.

## 2. Turbo Dev Server Shortcut
- Added `npm run dev:turbo` / `pnpm dev:turbo` / `yarn dev:turbo`.
- Turbopack gives noticeably faster HMR on large projects.
- Use plain `npm run dev` if you hit any Turbopack edge cases.

## 3. Optional flags while coding
- Skip type-check and lint in dev session:
  ```bash
  NEXT_DISABLE_SSR=1 NEXT_SKIP_PREFLIGHT_CHECK=1 npm run dev:turbo
  ```
  (Use only if you know what you are doing; otherwise keep defaults.)
- Disable Fast Refresh temporarily when debugging global state:
  ```bash
  NEXT_DISABLE_FAST_REFRESH=1 npm run dev
  ```

## 4. Watcher housekeeping
- Close unused editors/IDE terminals that keep extra watchers alive.
- Avoid editing gigantic JSON dumps (they trigger full rebuilds).

## 5. Profiling a slow rebuild
If it ever regresses:
```bash
NEXT_PRIVATE_TURBO_TRACE=1 npm run dev:turbo
```
This prints a flamegraph path so you can spot the slow chunk.

## TL;DR
- Use `npm run dev:turbo` for day-to-day work.
- Keep production-only optimizations out of dev.
- Flip the optional env flags only when necessary.

