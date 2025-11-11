import fs from 'fs'
import path from 'path'

const LOG_DIR = path.join(process.cwd(), 'data')
const LOG_FILE = path.join(LOG_DIR, 'report-exports.log')

export async function appendAudit(entry: Record<string, any>) {
  try {
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true })
    const line = JSON.stringify({ ts: new Date().toISOString(), ...entry }) + '\n'
    fs.appendFileSync(LOG_FILE, line, { encoding: 'utf8' })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to write audit log', err)
  }
}

export default appendAudit
