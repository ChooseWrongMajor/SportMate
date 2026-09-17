import { MatchCard } from '../components/MatchCard'
import { sports } from '../data/mockData'
import type { Match, Player } from '../types'

type MatchesPageProps = {
  search: string
  setSearch: (value: string) => void
  selectedSport: string
  setSelectedSport: (value: string) => void
  distanceFilter: string
  setDistanceFilter: (value: string) => void
  levelFilter: string
  setLevelFilter: (value: string) => void
  matches: Match[]
  joinedMatches: number[]
  joinMatch: (match: Match) => void
  setSelectedMatch: (match: Match) => void
  setChatMatch: (match: Match) => void
  enableLocation: () => void
  locationEnabled: boolean
  onCreate: () => void
  players: Player[]
  currentUser: Player
}

export function MatchesPage({
  search,
  setSearch,
  selectedSport,
  setSelectedSport,
  distanceFilter,
  setDistanceFilter,
  levelFilter,
  setLevelFilter,
  matches,
  joinedMatches,
  joinMatch,
  setSelectedMatch,
  setChatMatch,
  enableLocation,
  locationEnabled,
  onCreate,
  players,
  currentUser,
}: MatchesPageProps) {
  return (
    <main className="page">
      <div className="container">
        <div className="page-heading">
          <span className="section-eyebrow">KHÁM PHÁ</span>

          <h1>Tìm kèo phù hợp với bạn.</h1>

          <p>Tìm trận đấu, đồng đội và đối thủ trong khu vực của bạn.</p>
        </div>

        <div className="search-panel">
          <div className="large-search">
            <span>⌕</span>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm tên kèo hoặc địa điểm..."
            />
          </div>

          <button
            className={locationEnabled ? 'filter-button selected' : 'filter-button'}
            onClick={enableLocation}
          >
            ⌖ {locationEnabled ? 'Đã xác định' : 'Gần tôi'}
          </button>

          <button className="filter-button" onClick={onCreate}>
            + Tạo kèo
          </button>
        </div>

        <div className="filter-row">
          {sports.map((sport) => (
            <button
              key={sport.id}
              className={selectedSport === sport.id ? 'filter-chip selected' : 'filter-chip'}
              onClick={() => setSelectedSport(sport.id)}
            >
              {sport.icon} {sport.name}
            </button>
          ))}

          <select
            value={distanceFilter}
            onChange={(event) => setDistanceFilter(event.target.value)}
          >
            <option value="all">Mọi khoảng cách</option>
            <option value="1">Trong 1 km</option>
            <option value="3">Trong 3 km</option>
            <option value="5">Trong 5 km</option>
          </select>

          <select
            value={levelFilter}
            onChange={(event) => setLevelFilter(event.target.value)}
          >
            <option value="all">Mọi trình độ</option>
            <option value="Mới chơi">Mới chơi</option>
            <option value="Trung bình">Trung bình</option>
            <option value="Khá">Khá</option>
          </select>
        </div>

        <div className="results-header">
          <div>
            <strong>{matches.length}</strong>
            <span> kèo được tìm thấy</span>
          </div>

          <button>Sắp xếp: Gần nhất ▾</button>
        </div>

        {matches.length === 0 ? (
          <div className="empty-state">
            <div>⌕</div>
            <h3>Không tìm thấy kèo phù hợp</h3>
            <p>Thử thay đổi bộ lọc hoặc tự tạo một kèo mới.</p>

            <button className="primary-button" onClick={onCreate}>
              + Tạo kèo
            </button>
          </div>
        ) : (
          <div className="match-grid match-grid-large">
            {matches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                joined={joinedMatches.includes(match.id)}
                onJoin={() => joinMatch(match)}
                onDetail={() => setSelectedMatch(match)}
                onChat={() => setChatMatch(match)}
                host={
                  match.hostId === currentUser.id
                    ? currentUser
                    : players.find((player) => player.id === match.hostId) ??
                      currentUser
                }
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
