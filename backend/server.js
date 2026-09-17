const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const { pool, initializeDatabase } = require('./database')

const app = express()
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET || 'sportmate_dev_secret'
app.use(cors())
app.use(express.json())

const matchSelect = `SELECT m.id, m.title, m.sport, m.icon, m.location, m.distance,
  m.date_label, m.time_label, m.max_players, m.level, m.price, m.host_id, m.lat, m.lng,
  COUNT(mp.user_id)::int AS players FROM matches m
  LEFT JOIN match_participants mp ON mp.match_id = m.id`

const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next)

function publicUser(user) {
  return { id: Number(user.id), name: user.name, email: user.email, initials: user.initials,
    sport: user.sport, level: user.level, distance: '0 km', reputation: user.reputation,
    matches: user.matches_count, reviews: user.reviews_count }
}

function publicMatch(row) {
  return { id: Number(row.id), title: row.title, sport: row.sport, icon: row.icon,
    location: row.location, distance: Number(row.distance), date: row.date_label,
    time: row.time_label, players: Number(row.players), maxPlayers: Number(row.max_players),
    level: row.level, price: row.price, hostId: Number(row.host_id), lat: Number(row.lat), lng: Number(row.lng) }
}

async function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Token không hợp lệ.' })
  try {
    const decoded = jwt.verify(header.slice(7), JWT_SECRET)
    const result = await pool.query(`SELECT id, name, email, initials, sport, level, reputation,
      matches_count, reviews_count FROM users WHERE id = $1`, [decoded.id])
    if (!result.rows[0]) return res.status(401).json({ message: 'Người dùng không tồn tại.' })
    req.user = result.rows[0]
    return next()
  } catch { return res.status(401).json({ message: 'Token hết hạn hoặc không hợp lệ.' }) }
}

function createToken(user) {
  return jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
}

app.get('/api/health', (req, res) => res.json({ ok: true, message: 'SportMate backend is running' }))

app.post('/api/register', asyncRoute(async (req, res) => {
  const name = req.body.name?.trim()
  const email = req.body.email?.trim().toLowerCase()
  const password = req.body.password
  if (!name || !email || !password || password.length < 6) {
    return res.status(400).json({ message: 'Tên, email và mật khẩu tối thiểu 6 ký tự là bắt buộc.' })
  }
  const initials = name.split(/\s+/).map((part) => part[0]).join('').slice(-2).toUpperCase()
  const passwordHash = await bcrypt.hash(password, 10)
  const result = await pool.query(`INSERT INTO users (name, email, password_hash, initials)
    VALUES ($1, $2, $3, $4) RETURNING id, name, email, initials, sport, level, reputation, matches_count, reviews_count`,
    [name, email, passwordHash, initials])
  const user = result.rows[0]
  res.status(201).json({ message: 'Đăng ký thành công', token: createToken(user), user: publicUser(user) })
}))

app.post('/api/login', asyncRoute(async (req, res) => {
  const email = req.body.email?.trim().toLowerCase()
  const result = await pool.query(`SELECT id, name, email, password_hash, initials, sport, level,
    reputation, matches_count, reviews_count FROM users WHERE email = $1`, [email])
  const user = result.rows[0]
  if (!user || !(await bcrypt.compare(req.body.password || '', user.password_hash))) {
    return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' })
  }
  res.json({ message: 'Đăng nhập thành công', token: createToken(user), user: publicUser(user) })
}))

app.get('/api/me', requireAuth, (req, res) => res.json({ user: publicUser(req.user) }))

app.get('/api/players', asyncRoute(async (req, res) => {
  const result = await pool.query(`SELECT id, name, email, initials, sport, level, reputation,
    matches_count, reviews_count FROM users ORDER BY reputation DESC, name`)
  res.json({ players: result.rows.map(publicUser) })
}))

app.get('/api/players/:id', asyncRoute(async (req, res) => {
  const result = await pool.query(`SELECT id, name, email, initials, sport, level, reputation,
    matches_count, reviews_count FROM users WHERE id = $1`, [req.params.id])
  if (!result.rows[0]) return res.status(404).json({ message: 'Người chơi không tồn tại.' })
  res.json({ player: publicUser(result.rows[0]) })
}))

app.get('/api/matches', asyncRoute(async (req, res) => {
  const values = []
  const filters = []
  if (req.query.sport && req.query.sport !== 'all') { values.push(req.query.sport); filters.push(`m.sport = $${values.length}`) }
  if (req.query.level && req.query.level !== 'all') { values.push(req.query.level); filters.push(`m.level = $${values.length}`) }
  if (req.query.search) { values.push(`%${req.query.search}%`); filters.push(`(m.title ILIKE $${values.length} OR m.location ILIKE $${values.length})`) }
  if (req.query.maxDistance && req.query.maxDistance !== 'all') { values.push(Number(req.query.maxDistance)); filters.push(`m.distance <= $${values.length}`) }
  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : ''
  const result = await pool.query(`${matchSelect} ${where} GROUP BY m.id ORDER BY m.created_at DESC`, values)
  res.json({ matches: result.rows.map(publicMatch) })
}))

app.get('/api/matches/:id', asyncRoute(async (req, res) => {
  const result = await pool.query(`${matchSelect} WHERE m.id = $1 GROUP BY m.id`, [req.params.id])
  if (!result.rows[0]) return res.status(404).json({ message: 'Kèo không tồn tại.' })
  res.json({ match: publicMatch(result.rows[0]) })
}))

app.post('/api/matches', requireAuth, asyncRoute(async (req, res) => {
  const { title, sport, icon, location, date, time, maxPlayers, level, price, lat, lng, distance } = req.body
  if (!title?.trim() || !sport || !location?.trim() || !maxPlayers) return res.status(400).json({ message: 'Tên kèo, môn thể thao, địa điểm và số người là bắt buộc.' })
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const inserted = await client.query(`INSERT INTO matches (title, sport, icon, location, distance,
      date_label, time_label, max_players, level, price, host_id, lat, lng)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id`,
      [title.trim(), sport, icon || '', location.trim(), Number(distance || 0.5), date || 'Sắp tới', time || 'Chưa xác định', Number(maxPlayers), level || 'Mọi trình độ', price || 'Miễn phí', req.user.id, Number(lat || 10.85), Number(lng || 106.76)])
    const id = inserted.rows[0].id
    await client.query('INSERT INTO match_participants (match_id, user_id) VALUES ($1,$2)', [id, req.user.id])
    await client.query('INSERT INTO notifications (user_id, title, text) VALUES ($1,$2,$3)', [req.user.id, 'Kèo đã được tạo', title.trim()])
    await client.query('COMMIT')
    const created = await pool.query(`${matchSelect} WHERE m.id = $1 GROUP BY m.id`, [id])
    res.status(201).json({ match: publicMatch(created.rows[0]) })
  } catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release() }
}))

app.post('/api/matches/:id/join', requireAuth, asyncRoute(async (req, res) => {
  const match = await pool.query('SELECT id, title, max_players FROM matches WHERE id = $1', [req.params.id])
  if (!match.rows[0]) return res.status(404).json({ message: 'Kèo không tồn tại.' })
  const joined = await pool.query(`INSERT INTO match_participants (match_id, user_id)
    SELECT $1,$2 WHERE (SELECT COUNT(*) FROM match_participants WHERE match_id = $1) < $3
    ON CONFLICT DO NOTHING RETURNING match_id`, [req.params.id, req.user.id, match.rows[0].max_players])
  if (!joined.rows[0]) return res.status(409).json({ message: 'Kèo đã đủ người hoặc bạn đã tham gia.' })
  await pool.query('INSERT INTO notifications (user_id, title, text) VALUES ($1,$2,$3)', [req.user.id, 'Tham gia kèo thành công', match.rows[0].title])
  res.status(201).json({ joined: true, matchId: Number(req.params.id) })
}))

app.delete('/api/matches/:id/join', requireAuth, asyncRoute(async (req, res) => {
  const result = await pool.query('DELETE FROM match_participants WHERE match_id=$1 AND user_id=$2 RETURNING match_id', [req.params.id, req.user.id])
  if (!result.rows[0]) return res.status(404).json({ message: 'Bạn chưa tham gia kèo này.' })
  res.json({ joined: false, matchId: Number(req.params.id) })
}))

app.get('/api/me/matches', requireAuth, asyncRoute(async (req, res) => {
  const result = await pool.query(`${matchSelect} JOIN match_participants mine ON mine.match_id=m.id AND mine.user_id=$1 GROUP BY m.id ORDER BY m.created_at DESC`, [req.user.id])
  res.json({ matches: result.rows.map(publicMatch) })
}))

app.get('/api/matches/:id/messages', requireAuth, asyncRoute(async (req, res) => {
  const result = await pool.query(`SELECT msg.id, msg.text, msg.created_at, u.id AS user_id, u.name, u.initials
    FROM messages msg JOIN users u ON u.id=msg.user_id WHERE msg.match_id=$1 ORDER BY msg.created_at`, [req.params.id])
  res.json({ messages: result.rows.map((row) => ({ id: Number(row.id), sender: row.name, initials: row.initials,
    text: row.text, time: new Date(row.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }), mine: Number(row.user_id) === Number(req.user.id) })) })
}))

app.post('/api/matches/:id/messages', requireAuth, asyncRoute(async (req, res) => {
  const text = req.body.text?.trim()
  if (!text) return res.status(400).json({ message: 'Nội dung tin nhắn không được để trống.' })
  const result = await pool.query('INSERT INTO messages (match_id,user_id,text) VALUES ($1,$2,$3) RETURNING id,text,created_at', [req.params.id, req.user.id, text])
  const row = result.rows[0]
  res.status(201).json({ message: { id: Number(row.id), sender: req.user.name, initials: req.user.initials, text: row.text,
    time: new Date(row.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }), mine: true } })
}))

app.get('/api/notifications', requireAuth, asyncRoute(async (req, res) => {
  const result = await pool.query('SELECT id,title,text,created_at,unread FROM notifications WHERE user_id=$1 ORDER BY created_at DESC', [req.user.id])
  res.json({ notifications: result.rows.map((row) => ({ id: Number(row.id), title: row.title, text: row.text, time: new Date(row.created_at).toLocaleString('vi-VN'), unread: row.unread })) })
}))

app.patch('/api/notifications/read', requireAuth, asyncRoute(async (req, res) => {
  await pool.query('UPDATE notifications SET unread=false WHERE user_id=$1', [req.user.id])
  res.json({ updated: true })
}))

app.use((error, req, res, next) => {
  if (error.code === '23505') return res.status(409).json({ message: 'Email đã tồn tại.' })
  console.error(error)
  res.status(500).json({ message: 'Lỗi máy chủ.' })
})

initializeDatabase()
  .then(() => app.listen(PORT, () => console.log(`SportMate backend running on http://localhost:${PORT}`)))
  .catch((error) => { console.error('Không thể khởi tạo database:', error.message); process.exit(1) })
