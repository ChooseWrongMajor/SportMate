const fs = require('fs')
const path = require('path')
const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
})

async function initializeDatabase() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
  await pool.query(schema)

  const count = await pool.query('SELECT COUNT(*)::int AS count FROM users')
  if (count.rows[0].count > 0) return

  const passwordHash = await bcrypt.hash('password123', 10)
  await pool.query(
    `INSERT INTO users (id, name, email, password_hash, initials, sport, level, reputation, matches_count, reviews_count)
     VALUES
       (1, 'Minh Anh', 'minhanh@sportmate.local', $1, 'MA', 'Bóng đá', 'Khá', 96, 42, 38),
       (2, 'Hoàng Nam', 'hoangnam@sportmate.local', $1, 'HN', 'Cầu lông', 'Khá', 92, 31, 29),
       (3, 'Quốc Huy', 'quochuy@sportmate.local', $1, 'QH', 'Bóng đá', 'Trung bình', 88, 27, 21),
       (4, 'Tuấn Anh', 'tuananh@sportmate.local', $1, 'TA', 'Bóng rổ', 'Khá', 97, 56, 51),
       (5, 'Gia Bảo', 'giabao@sportmate.local', $1, 'GB', 'Bida', 'Khá', 94, 35, 32),
       (6, 'Thanh Tùng', 'thanhtung@sportmate.local', $1, 'TT', 'Tennis', 'Khá', 91, 24, 20)`,
    [passwordHash],
  )
  await pool.query(`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))`)
}

module.exports = { pool, initializeDatabase }