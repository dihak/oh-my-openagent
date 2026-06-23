# Publishing a personal fork to npm (OpenCode Ultimate)

Use this when you maintain a fork (for example `@dihak/oh-my-openagent`) and want other machines to install without cloning the repo.

## Package identity

Apply fork metadata from the repo template (keeps upstream `package.json` unchanged until you run this):

```bash
node script/apply-fork-package.mjs
```

That merges [`package.fork.json`](../package.fork.json) into `package.json` (name, version, `publishConfig`, clears platform `optionalDependencies`, updates `repository` URLs). Edit `package.fork.json` before applying if you need a different version or scope.

Or set root `package.json` manually:

1. Set root `package.json`:
   - `"name": "@dihak/oh-my-openagent"` (your scope)
   - `"version": "4.13.0-dihak.1"` (or your own semver line)
   - `"publishConfig": { "access": "public" }`
2. Optional: remove `optionalDependencies` for upstream platform binaries if you are not publishing `@dihak/oh-my-openagent-linux-x64` packages. The CLI falls back to `dist/cli-node/index.js` (Node).
3. Set `OMO_SKIP_PLATFORM_BINARY=1` in CI publish if you skip platform optional deps (see workflow below).

The installer registers your scoped name in `opencode.json`, for example `"plugin": ["@dihak/oh-my-openagent"]`. Config files can still use `oh-my-openagent.jsonc`.

## One-time publish (manual)

```bash
bun install
bun run build
npm login
npm publish --access public
```

`prepublishOnly` runs a full build. Do not publish without `dist/` and `dist/cli-node/`.

## GitHub Actions

Workflow: [`.github/workflows/publish-fork.yml`](../.github/workflows/publish-fork.yml)

1. Add repo secret `NPM_TOKEN` (Automation token from npmjs.com).
2. Actions → **Publish fork to npm** → Run workflow.
3. Bump `version` in `package.json` on branch `dihak` (or your publish branch) before each run.

## Install on another machine

Prerequisites: [OpenCode](https://opencode.ai) and Node or Bun.

```bash
bunx @dihak/oh-my-openagent install
# or
npx @dihak/oh-my-openagent install
```

Verify `~/.config/opencode/opencode.json` contains your scoped plugin entry, then restart OpenCode.

## Override without republishing

For local testing only:

```bash
export OMO_PUBLISHED_PACKAGE_NAME=@dihak/oh-my-openagent
```

## Upstream vs fork

| | Upstream | Your fork |
|---|----------|-----------|
| npm name | `oh-my-openagent` / `oh-my-opencode` | `@dihak/oh-my-openagent` |
| Publish | Their `publish.yml` | `publish-fork.yml` or manual |
| Platform binaries | 12 optional packages | Optional; use Node CLI fallback |