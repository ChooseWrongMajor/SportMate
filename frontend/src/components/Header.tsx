import type { Page } from '../types'

type HeaderProps = {
  page: Page
  navigate: (page: Page) => void
  onCreate: () => void
  onLogin: () => void
  unread: number
  onNotification: () => void
  userName?: string
}

export function Header({
  page,
  navigate,
  onCreate,
  onLogin,
  unread,
  onNotification,
  userName,
}: HeaderProps) {
  const initials = userName
    ? userName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('')
        .slice(0, 2)
    : 'BH'

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <button className="brand" onClick={() => navigate('home')}>
          <span className="brand-mark">S</span>
          <span>
            Sport<span>Mate</span>
          </span>
        </button>

        <nav className="desktop-nav">
          <button
            className={page === 'home' ? 'active' : ''}
            onClick={() => navigate('home')}
          >
            Trang chủ
          </button>

          <button
            className={page === 'matches' ? 'active' : ''}
            onClick={() => navigate('matches')}
          >
            Tìm kèo
          </button>

          <button
            className={page === 'map' ? 'active' : ''}
            onClick={() => navigate('map')}
          >
            Bản đồ
          </button>

          <button
            className={page === 'players' ? 'active' : ''}
            onClick={() => navigate('players')}
          >
            Người chơi
          </button>
        </nav>

        <div className="nav-right">
          <button className="notification-button" onClick={onNotification}>
            ♢
            {unread > 0 && <span className="notification-dot">{unread}</span>}
          </button>

          <button className="create-button" onClick={onCreate}>
            + Tạo kèo
          </button>

          <button className="profile-button" onClick={() => navigate('profile')}>
            <span>{initials}</span>
            <b>▾</b>
          </button>

          <button className="login-button" onClick={onLogin}>
            {userName ? 'Tài khoản' : 'Đăng nhập'}
          </button>
        </div>
      </div>
    </header>
  )
}
