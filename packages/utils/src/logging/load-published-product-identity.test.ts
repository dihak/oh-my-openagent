import { afterEach, beforeEach, describe, expect, it } from "bun:test"
import { mkdirSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { loadPublishedProductIdentity } from "./load-published-product-identity"

describe("loadPublishedProductIdentity", () => {
  let root = ""

  beforeEach(() => {
    root = join(tmpdir(), `omo-identity-${Date.now()}-${Math.random().toString(36).slice(2)}`)
    mkdirSync(root, { recursive: true })
  })

  afterEach(() => {
    delete process.env.OMO_PUBLISHED_PACKAGE_NAME
    rmSync(root, { recursive: true, force: true })
  })

  it("uses root package.json name as plugin and published id", () => {
    writeFileSync(
      join(root, "package.json"),
      JSON.stringify({ name: "@dihak/oh-my-openagent", version: "4.13.0-dihak.1" }),
    )

    const id = loadPublishedProductIdentity(root)

    expect(id.pluginName).toBe("@dihak/oh-my-openagent")
    expect(id.publishedPackageName).toBe("@dihak/oh-my-openagent")
    expect(id.acceptedPackageNames).toContain("@dihak/oh-my-openagent")
    expect(id.acceptedPackageNames).toContain("oh-my-opencode")
  })

  it("prefers OMO_PUBLISHED_PACKAGE_NAME over package.json", () => {
    writeFileSync(join(root, "package.json"), JSON.stringify({ name: "other" }))

    process.env.OMO_PUBLISHED_PACKAGE_NAME = "@dihak/oh-my-openagent"

    const id = loadPublishedProductIdentity(root)

    expect(id.publishedPackageName).toBe("@dihak/oh-my-openagent")
  })
})