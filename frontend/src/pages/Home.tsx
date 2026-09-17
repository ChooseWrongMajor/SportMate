import { MatchCard } from '../components/MatchCard'
import { PlayerCard } from '../components/PlayerCard'
import { SectionHeader } from '../components/SectionHeader'
import { sports } from '../data/mockData'
import type { Match, Page, Player } from '../types'

type HomePageProps = {
  search: string
  setSearch: (value: string) => void
  selectedSport: string
  setSelectedSport: (value: string) => void
  matches: Match[]
  joinedMatches: number[]
  players: Player[]
  locationEnabled: boolean
  enableLocation: () => void
  navigate: (page: Page) => void
  joinMatch: (match: Match) => void
  setSelectedMatch: (match: Match) => void
  setChatMatch: (match: Match) => void
  setSelectedPlayer: (player: Player) => void
  onCreate: () => void
}

export function HomePage({
  search,
  setSearch,
  selectedSport,
  setSelectedSport,
  matches,
  joinedMatches,
  players,
  locationEnabled,
  enableLocation,
  navigate,
  joinMatch,
  setSelectedMatch,
  setChatMatch,
  setSelectedPlayer,
  onCreate,
}: HomePageProps) {
  return (
    <>
      <section className="hero">
        <div className="hero-noise"></div>
        <div className="hero-glow hero-glow-one"></div>
        <div className="hero-glow hero-glow-two"></div>

        <div className="container hero-inner">
          <div className="hero-copy">
            <div className="status-pill">
              <span></span>
              Cộng đồng thể thao đang hoạt động
            </div>

            <h1>
              Đừng để
              <br />
              <em>thiếu người</em>
              <br />
              cản bạn chơi.
            </h1>

            <p>
              Tìm người chơi cùng, đối thủ hoặc một kèo thể thao gần bạn. Tham gia
              chỉ với vài cú click.
            </p>

            <div className="hero-search">
              <div className="hero-search-input">
                <span>⌕</span>

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Tìm môn thể thao, địa điểm..."
                />
              </div>

              <button className="near-button" onClick={enableLocation}>
                <span>⌖</span>
                {locationEnabled ? 'Đã xác định' : 'Gần tôi'}
              </button>

              <button className="hero-search-button" onClick={() => navigate('matches')}>
                Tìm kèo
              </button>
            </div>

            <div className="hero-trust">
              <div className="trust-avatars">
                {players.slice(0, 4).map((player) => (
                  <span key={player.id}>{player.initials}</span>
                ))}
              </div>

              <div>
                <strong>12.000+ người chơi</strong>
                <small>đang tìm đồng đội gần bạn</small>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-card visual-card-main">
              <div className="visual-card-top">
                <span>KÈO GẦN BẠN</span>
                <b>1.2 km</b>
              </div>

              <div className="visual-match-icon">⚽</div>

              <h3>Đá bóng sân Thủ Đức</h3>

              <p>⌖ Sân bóng Linh Tây</p>

              <div className="visual-match-meta">
                <span>◷ 19:00 - 21:00</span>
                <span>👥 7/10</span>
              </div>

              <div className="visual-progress">
                <span style={{ width: '70%' }}></span>
              </div>

              <div className="visual-host">
                <div className="mini-avatar">MA</div>

                <div>
                  <small>Chủ kèo</small>
                  <strong>Minh Anh · ★ 96</strong>
                </div>

                <button onClick={() => setSelectedMatch(matches[0])}>→</button>
              </div>
            </div>

            <div className="floating-card floating-location">
              <span>⌖</span>
              <div>
                <strong>24 kèo</strong>
                <small>trong bán kính 5 km</small>
              </div>
            </div>

            <div className="floating-card floating-rating">
              <span>★</span>
              <div>
                <strong>96/100</strong>
                <small>điểm uy tín</small>
              </div>
            </div>

            <div className="hero-orb">
              <span>⚽</span>
            </div>
          </div>
        </div>
      </section>

      <section className="sports-strip">
        <div className="container">
          <div className="section-label">
            <span>01</span>
            <b>CHỌN MÔN BẠN MUỐN CHƠI</b>
          </div>

          <div className="sports-list">
            {sports.map((sport) => (
              <button
                key={sport.id}
                className={selectedSport === sport.id ? 'sport-chip selected' : 'sport-chip'}
                onClick={() => {
                  setSelectedSport(sport.id)
                  navigate('matches')
                }}
              >
                <span>{sport.icon}</span>
                {sport.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section matches-home">
        <div className="container">
          <SectionHeader
            eyebrow="GẦN BẠN"
            title="Kèo đang chờ bạn"
            description="Những trận đấu đang tìm người tham gia."
            action="Xem tất cả"
            onAction={() => navigate('matches')}
          />

          <div className="match-grid">
            {matches.slice(0, 3).map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                joined={joinedMatches.includes(match.id)}
                onJoin={() => joinMatch(match)}
                onDetail={() => setSelectedMatch(match)}
                onChat={() => setChatMatch(match)}
                host={players.find((player) => player.id === match.hostId) ?? players[0]}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="create-section">
        <div className="container">
          <div className="create-banner">
            <div className="create-banner-copy">
              <span className="section-eyebrow">KHÔNG TÌM THẤY KÈO PHÙ HỢP?</span>

              <h2>
                Tự tạo kèo.
                <br />
                Để mọi người tìm thấy bạn.
              </h2>

              <p>
                Chọn môn thể thao, địa điểm, thời gian và số người. SportMate sẽ
                giúp những người chơi gần bạn tìm thấy kèo.
              </p>

              <button className="primary-button" onClick={onCreate}>
                + Tạo kèo mới
              </button>
            </div>

            <div className="create-art">
              <div className="art-circle art-circle-one"></div>
              <div className="art-circle art-circle-two"></div>

              <div className="art-ball">⚽</div>

              <span className="art-line line-a"></span>
              <span className="art-line line-b"></span>
              <span className="art-line line-c"></span>
            </div>
          </div>
        </div>
      </section>

      <section className="section players-home">
        <div className="container">
          <SectionHeader
            eyebrow="CỘNG ĐỒNG"
            title="Người chơi uy tín gần bạn"
            description="Biết mình đang chơi cùng ai trước khi tham gia."
            action="Xem tất cả"
            onAction={() => navigate('players')}
          />

          <div className="player-grid">
            {players.slice(0, 4).map((player) => (
              <PlayerCard key={player.id} player={player} onClick={() => setSelectedPlayer(player)} />
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />
    </>
  )
}

function HowItWorks() {
  return (
    <section className="how-section">
      <div className="container">
        <div className="center-heading">
          <span className="section-eyebrow">ĐƠN GIẢN</span>
          <h2>
            Từ không có người chơi
            <br />
            đến một trận đấu.
          </h2>

          <p>SportMate giúp bạn tìm đúng người, đúng nơi và đúng thời điểm.</p>
        </div>

        <div className="steps">
          <div className="step">
            <span>01</span>
            <div>⌕</div>
            <h3>Tìm kèo</h3>
            <p>Chọn môn thể thao và tìm những trận đấu gần bạn.</p>
          </div>

          <div className="step-connector"></div>

          <div className="step">
            <span>02</span>
            <div>♟</div>
            <h3>Tham gia</h3>
            <p>Xem điểm uy tín và thông tin trước khi tham gia.</p>
          </div>

          <div className="step-connector"></div>

          <div className="step">
            <span>03</span>
            <div>★</div>
            <h3>Chơi hết mình</h3>
            <p>Gặp gỡ người mới và xây dựng điểm uy tín của bạn.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
