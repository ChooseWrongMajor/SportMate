import type { Match, Player } from '../../types'

type MatchModalProps = {
  match: Match
  host: Player
  joined: boolean
  onClose: () => void
  onJoin: () => void
  onChat: () => void
}

export function MatchModal({ match, host, joined, onClose, onJoin, onChat }: MatchModalProps) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal match-modal" onClick={(event) => event.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <div className="modal-icon">{match.icon}</div>

        <span className="section-eyebrow">CHI TIẾT KÈO</span>

        <h2>{match.title}</h2>

        <div className="modal-location">
          <span>⌖</span>
          <div>
            <small>ĐỊA ĐIỂM</small>
            <strong>{match.location}</strong>
          </div>
        </div>

        <div className="modal-info-grid">
          <div>
            <small>NGÀY</small>
            <strong>{match.date}</strong>
          </div>

          <div>
            <small>THỜI GIAN</small>
            <strong>{match.time}</strong>
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

        <div className="modal-host">
          <div className="player-avatar">{host.initials}</div>

          <div>
            <small>CHỦ KÈO</small>
            <strong>{host.name}</strong>
            <span>
              ★ {host.reputation} điểm uy tín · {host.matches} trận
            </span>
          </div>

          <button>→</button>
        </div>

        <div className="modal-capacity">
          <div>
            <span>Người chơi</span>
            <strong>
              {match.players}/{match.maxPlayers}
            </strong>
          </div>

          <div className="progress-track">
            <span
              style={{
                width: `${(match.players / match.maxPlayers) * 100}%`,
              }}
            ></span>
          </div>
        </div>

        <div className="modal-actions">
          <button className="secondary-button" onClick={onChat}>
            Chat kèo
          </button>

          <button
            className={joined ? 'primary-button danger' : 'primary-button'}
            onClick={onJoin}
          >
            {joined ? 'Rời kèo' : 'Tham gia kèo'}
          </button>
        </div>
      </div>
    </div>
  )
}
