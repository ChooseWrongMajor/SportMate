# SportMate Backend

Express API cho xác thực, người chơi, kèo thể thao, tham gia kèo, chat và thông báo.

## Cài đặt

```bash
npm install
```

Tạo `backend/.env` từ `.env.example` và điền connection string PostgreSQL của Supabase. Server tự tạo bảng từ `schema.sql` khi khởi động lần đầu và tạo sáu người chơi mẫu. Tài khoản mẫu dùng mật khẩu `password123`.

## Chạy

```bash
npm run dev
```

## API

- GET /api/health
- POST /api/register
- POST /api/login
- GET /api/me
- GET /api/players, GET /api/players/:id
- GET /api/matches, GET /api/matches/:id, POST /api/matches
- POST /api/matches/:id/join, DELETE /api/matches/:id/join
- GET /api/me/matches
- GET/POST /api/matches/:id/messages
- GET /api/notifications, PATCH /api/notifications/read

Các route cần đăng nhập nhận header:

```text
Authorization: Bearer <token>
```

`GET /api/matches` hỗ trợ query `sport`, `level`, `search` và `maxDistance`.

### Ví dụ đăng ký

```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Nguyen Van A","email":"a@example.com","password":"123456"}'
```

### Ví dụ đăng nhập

```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"a@example.com","password":"123456"}'
```
