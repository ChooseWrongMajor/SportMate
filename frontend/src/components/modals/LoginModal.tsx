import { useState } from 'react'

type LoginModalProps = {
  onClose: () => void
  onSubmit: (
    payload: { name?: string; email: string; password: string },
    mode: 'login' | 'register',
  ) => Promise<void>
  loading: boolean
  error: string | null
}

export function LoginModal({ onClose, onSubmit, loading, error }: LoginModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      return
    }

    await onSubmit(
      {
        name: mode === 'register' ? name.trim() : undefined,
        email: email.trim(),
        password,
      },
      mode,
    )
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal login-modal" onClick={(event) => event.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <div className="login-brand">
          <span className="brand-mark">S</span>
          <span>
            Sport<span>Mate</span>
          </span>
        </div>

        <h2>{mode === 'login' ? 'Chào mừng trở lại.' : 'Tạo tài khoản.'}</h2>

        <p className="modal-description">
          {mode === 'login'
            ? 'Đăng nhập để tìm và tham gia các kèo gần bạn.'
            : 'Tham gia cộng đồng SportMate và bắt đầu chơi.'}
        </p>

        {mode === 'register' && (
          <label>
            Tên của bạn
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nguyễn Văn A"
            />
          </label>
        )}

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
        </label>

        <label>
          Mật khẩu
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button className="primary-button full login-submit" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Đang xử lý...' : mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
        </button>

        <button
          className="switch-auth"
          onClick={() => setMode((current) => (current === 'login' ? 'register' : 'login'))}
        >
          {mode === 'login' ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
        </button>

        <small className="demo-note">Đăng nhập thật sẽ được kết nối với backend ở cổng 5000.</small>
      </div>
    </div>
  )
}
