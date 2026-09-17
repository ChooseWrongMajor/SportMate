import type { Match } from '../types'

type MapPageProps = {
  matches: Match[]
  locationEnabled: boolean
  enableLocation: () => void
  setSelectedMatch: (match: Match) => void
}

export function MapPage({
  matches,
  locationEnabled,
  enableLocation,
  setSelectedMatch,
}: MapPageProps) {
  return (
    <main className="map-page">
      <div className="container">
        <div className="page-heading map-heading">
          <span className="section-eyebrow">KHÁM PHÁ BẰNG BẢN ĐỒ</span>

          <h1>Kèo thể thao quanh bạn.</h1>

          <p>Chọn một điểm trên bản đồ để xem thông tin trận đấu.</p>
        </div>

        <div className="map-layout">
          <div className="fake-map">
            <div className="map-street street-1"></div>
            <div className="map-street street-2"></div>
            <div className="map-street street-3"></div>
            <div className="map-street street-4"></div>

            <div className="map-area-label label-a">THỦ ĐỨC</div>
            <div className="map-area-label label-b">LINH TÂY</div>
            <div className="map-area-label label-c">BÌNH THỌ</div>

            <div className="user-pin">
              <span></span>
            </div>

            {matches.slice(0, 6).map((match, index) => (
              <button
                key={match.id}
                className={`map-marker marker-${index + 1}`}
                onClick={() => setSelectedMatch(match)}
              >
                {match.icon}
              </button>
            ))}

            <div className="map-controls">
              <button onClick={enableLocation}>
                ⌖ {locationEnabled ? 'Đã xác định vị trí' : 'Vị trí của tôi'}
              </button>
              <button>＋</button>
              <button>−</button>
            </div>

            <div className="map-prototype-note">Bản đồ prototype</div>
          </div>

          <aside className="map-sidebar">
            <div className="sidebar-heading">
              <div>
                <span className="section-eyebrow">GẦN BẠN</span>
                <h2>{matches.length} kèo</h2>
              </div>

              <button>⌕</button>
            </div>

            <div className="map-match-list">
              {matches.map((match) => (
                <button
                  className="map-match-item"
                  key={match.id}
                  onClick={() => setSelectedMatch(match)}
                >
                  <span className="map-match-icon">{match.icon}</span>

                  <span className="map-match-content">
                    <strong>{match.title}</strong>
                    <small>⌖ {match.location}</small>
                    <small>
                      {match.distance} km · {match.players}/{match.maxPlayers} người
                    </small>
                  </span>

                  <span className="arrow">→</span>
                </button>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
