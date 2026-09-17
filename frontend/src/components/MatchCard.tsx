import { sports } from '../data/mockData'
import type { Match, Player } from '../types'

type MatchCardProps = {
  match: Match
  host: Player
  joined: boolean
  onJoin: () => void
  onDetail: () => void
  onChat: () => void
}

export function MatchCard({
  match,
  host,
  joined,
  onJoin,
  onDetail,
  onChat,
}: MatchCardProps) {
  const sport = sports.find((item) => item.id === match.sport)
  const progress = (match.players / match.maxPlayers) * 100

  return (
    <article className="match-card">
      <div className="match-card-header">
        <span className="match-sport-tag">
          {match.icon} {sport?.name}
        </span>

        <span className="match-distance">
          {match.distance === 0 ? 'Gần bạn' : `${match.distance} km`}
        </span>
      </div>

      <button className="match-card-title" onClick={onDetail}>
        {match.title}
      </button>

      <div className="match-location">
        <span>⌖</span>
        {match.location}
      </div>

      <div className="match-details">
        <div>
          <small>THỜI GIAN</small>
          <strong>
            {match.date}
            <br />
            {match.time}
          </strong>
        </div>

        <div>
          <small>TRÌNH ĐỘ</small>
          <strong>{match.level}</strong>
        </div>

        <div>
          <small>CHI PHÍ</small>
          <strong>{match.price}</strong>
        </div>
      </div>

      <div className="player-progress">
        <div>
          <span>Người chơi</span>
          <strong>
            {match.players}/{match.maxPlayers}
          </strong>
        </div>

        <div className="progress-track">
          <span style={{ width: `${Math.min(progress, 100)}%` }}></span>
        </div>
      </div>

      <div className="match-card-footer">
        <button className="host-mini" onClick={onDetail}>
          <span>{host.initials}</span>

          <div>
            <small>CHỦ KÈO</small>
            <strong>
              {host.name} · ★ {host.reputation}
            </strong>
          </div>
        </button>

        <div className="card-buttons">
          <button className="chat-small" onClick={onChat}>
            Chat
          </button>

          <button
            className={joined ? 'join-small joined' : 'join-small'}
            onClick={onJoin}
          >
            {joined ? 'Đã tham gia' : 'Tham gia'}
          </button>
        </div>
      </div>
    </article>
  )
}
