import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const nextBinary = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next')
const result = spawnSync(process.execPath, [nextBinary, 'build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NEXT_STATIC_EXPORT: 'true',
  },
})

if ((result.status ?? 1) !== 0) {
  process.exit(result.status ?? 1)
}

const outDir = path.join(process.cwd(), 'out')

function createFlatRscAliases(directory) {
  if (!fs.existsSync(directory)) {
    return
  }

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name)

    if (!entry.isDirectory()) {
      continue
    }

    const pageFile = path.join(entryPath, '__PAGE__.txt')

    if (entry.name.startsWith('__next') && fs.existsSync(pageFile)) {
      fs.copyFileSync(pageFile, path.join(directory, `${entry.name}.__PAGE__.txt`))
    }

    createFlatRscAliases(entryPath)
  }
}

createFlatRscAliases(outDir)
