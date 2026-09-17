import type { Match, Player } from '../types'

type ProfilePageProps = {
  user: Player
  joinedMatches: Match[]
  setSelectedMatch: (match: Match) => void
}

export function ProfilePage({ user, joinedMatches, setSelectedMatch }: ProfilePageProps) {
  return (
    <main className="page profile-page">
      <div className="container">
        <div className="profile-layout">
          <aside className="profile-sidebar">
            <div className="profile-avatar-large">{user.initials}</div>

            <h2>{user.name}</h2>

            <p>
              {user.sport} · {user.level}
            </p>

            <div className="profile-reputation">
              <strong>{user.reputation}</strong>
              <span>/100</span>
            </div>

            <small>ĐIỂM UY TÍN</small>

            <div className="reputation-bar">
              <span style={{ width: `${user.reputation}%` }}></span>
            </div>

            <button className="outline-button">Chỉnh sửa hồ sơ</button>
          </aside>

          <section className="profile-main">
            <div className="profile-stats">
              <div>
                <strong>{user.matches}</strong>
                <span>Trận đã chơi</span>
              </div>

              <div>
                <strong>{user.reviews}</strong>
                <span>Đánh giá</span>
              </div>

              <div>
                <strong>4.9</strong>
                <span>Rating</span>
              </div>

              <div>
                <strong>94%</strong>
                <span>Hoàn thành</span>
              </div>
            </div>

            <div className="profile-section">
              <div className="profile-section-heading">
                <div>
                  <span className="section-eyebrow">UY TÍN</span>
                  <h3>Vì sao mọi người tin bạn?</h3>
                </div>
              </div>

              <div className="trust-grid">
                <div>
                  <span>✓</span>
                  <div>
                    <strong>Đúng giờ</strong>
                    <small>Được cộng đồng đánh giá tốt</small>
                  </div>
                </div>

                <div>
                  <span>✓</span>
                  <div>
                    <strong>Ít hủy kèo</strong>
                    <small>Tỷ lệ hủy thấp hơn 90% người chơi</small>
                  </div>
                </div>

                <div>
                  <span>✓</span>
                  <div>
                    <strong>Chơi fair</strong>
                    <small>Thái độ tốt trong các trận đấu</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <div className="profile-section-heading">
                <div>
                  <span className="section-eyebrow">SẮP TỚI</span>
                  <h3>Kèo của bạn</h3>
                </div>
              </div>

              <div className="profile-match-list">
                {joinedMatches.length === 0 ? (
                  <p className="muted">Bạn chưa tham gia kèo nào.</p>
                ) : (
                  joinedMatches.map((match) => (
                    <button key={match.id} onClick={() => setSelectedMatch(match)}>
                      <span>{match.icon}</span>

                      <div>
                        <strong>{match.title}</strong>
                        <small>
                          {match.date} · {match.time}
                        </small>
                      </div>

                      <span>→</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
