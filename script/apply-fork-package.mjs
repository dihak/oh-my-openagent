#!/usr/bin/env node
/**
 * Merge package.fork.json into package.json for @dihak npm publish.
 * Usage: node script/apply-fork-package.mjs
 */
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { join, dirname } from "node:path"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const pkgPath = join(root, "package.json")
const forkPath = join(root, "package.fork.json")

const pkg = JSON.parse(readFileSync(pkgPath, "utf8"))
const fork = JSON.parse(readFileSync(forkPath, "utf8"))

const merged = { ...pkg, ...fork }
if (fork.optionalDependencies && Object.keys(fork.optionalDependencies).length === 0) {
  delete merged.optionalDependencies
}

writeFileSync(pkgPath, `${JSON.stringify(merged, null, 2)}\n`)
console.log(`Updated package.json name=${merged.name} version=${merged.version}`)