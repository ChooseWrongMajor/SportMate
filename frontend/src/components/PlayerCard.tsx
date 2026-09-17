import type { Player } from '../types'

type PlayerCardProps = {
  player: Player
  onClick: () => void
}

export function PlayerCard({ player, onClick }: PlayerCardProps) {
  return (
    <button className="player-card" onClick={onClick}>
      <div className="player-card-top">
        <div className="player-avatar">{player.initials}</div>

        <div className="player-reputation">
          <span>★</span>
          <strong>{player.reputation}</strong>
        </div>
      </div>

      <h3>{player.name}</h3>

      <p>
        {player.sport} · {player.level}
      </p>

      <div className="player-card-meta">
        <span>⌖ {player.distance}</span>
        <span>{player.matches} trận</span>
      </div>

      <div className="player-card-bottom">
        <span>{player.reviews} đánh giá</span>
        <b>→</b>
      </div>
    </button>
  )
}
