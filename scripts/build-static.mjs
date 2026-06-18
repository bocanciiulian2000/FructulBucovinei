import { spawnSync } from 'node:child_process'
import path from 'node:path'

const nextBinary = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next')
const result = spawnSync(process.execPath, [nextBinary, 'build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NEXT_STATIC_EXPORT: 'true',
  },
})

process.exit(result.status ?? 1)
