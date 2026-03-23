import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '..', 'dev.db')

const db = new Database(dbPath)
db.pragma('journal_mode = WAL')

// Create table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS user (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )
`)

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)
  const id = crypto.randomUUID()

  const existing = db.prepare('SELECT id FROM user WHERE username = ?').get('testuser')

  if (!existing) {
    db.prepare('INSERT INTO user (id, username, password) VALUES (?, ?, ?)').run(id, 'testuser', hashedPassword)
    console.log('✅ Seed successful: created user "testuser" with password "password123"')
  } else {
    console.log('ℹ️  User "testuser" already exists, skipping seed.')
  }

  db.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
