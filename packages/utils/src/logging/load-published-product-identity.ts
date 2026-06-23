import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { createProductIdentity, type ProductIdentity } from "./product-identity"

const LEGACY_PLUGIN_NAME = "oh-my-opencode"
const LEGACY_CONFIG_BASENAME = "oh-my-opencode"

function readRootPackageJson(startDir: string): { name?: string } | null {
  let dir = startDir
  for (let depth = 0; depth < 12; depth += 1) {
    try {
      const raw = readFileSync(join(dir, "package.json"), "utf8")
      return JSON.parse(raw) as { name?: string }
    } catch {
      const parent = dirname(dir)
      if (parent === dir) break
      dir = parent
    }
  }
  return null
}

function resolvePublishedPackageName(explicitStartDir?: string): string {
  const startDir =
    explicitStartDir ??
    (typeof import.meta.url === "string"
      ? dirname(fileURLToPath(import.meta.url))
      : process.cwd())

  const fromEnv = process.env.OMO_PUBLISHED_PACKAGE_NAME?.trim()
  if (fromEnv) return fromEnv

  const pkg = readRootPackageJson(startDir)
  if (pkg?.name && typeof pkg.name === "string") return pkg.name

  return "oh-my-openagent"
}

/**
 * Product identity for the published npm package. Plugin id and installer entries
 * use the root package.json `name` (e.g. `@dihak/oh-my-openagent` on a fork).
 */
export function loadPublishedProductIdentity(startDir?: string): ProductIdentity {
  const publishedPackageName = resolvePublishedPackageName(startDir)
  const legacyNames = [LEGACY_PLUGIN_NAME, "oh-my-openagent"]
  const acceptedPackageNames = [
    publishedPackageName,
    ...legacyNames.filter((name) => name !== publishedPackageName),
  ]

  return createProductIdentity({
    pluginName: publishedPackageName,
    legacyPluginName: LEGACY_PLUGIN_NAME,
    publishedPackageName,
    acceptedPackageNames,
    configBasename: "oh-my-openagent",
    legacyConfigBasename: LEGACY_CONFIG_BASENAME,
    logFileName: "oh-my-opencode.log",
    cacheDirName: "oh-my-opencode",
  })
}