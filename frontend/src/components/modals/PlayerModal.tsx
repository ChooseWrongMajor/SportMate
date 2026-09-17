import type { Player } from '../../types'

type PlayerModalProps = {
  player: Player
  onClose: () => void
}

export function PlayerModal({ player, onClose }: PlayerModalProps) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal player-modal" onClick={(event) => event.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <div className="profile-avatar-large">{player.initials}</div>

        <h2>{player.name}</h2>

        <p className="modal-player-subtitle">
          {player.sport} · {player.level}
        </p>

        <div className="big-reputation">
          <strong>{player.reputation}</strong>
          <span>/100</span>
          <small>ĐIỂM UY TÍN</small>
        </div>

        <div className="reputation-bar large">
          <span style={{ width: `${player.reputation}%` }}></span>
        </div>

        <div className="profile-modal-stats">
          <div>
            <strong>{player.matches}</strong>
            <small>Trận</small>
          </div>

          <div>
            <strong>{player.reviews}</strong>
            <small>Đánh giá</small>
          </div>

          <div>
            <strong>4.9</strong>
            <small>Rating</small>
          </div>
        </div>

        <div className="trust-list">
          <div>
            <span>✓</span>
            Đúng giờ
          </div>

          <div>
            <span>✓</span>
            Ít hủy kèo
          </div>

          <div>
            <span>✓</span>
            Chơi fair
          </div>

          <div>
            <span>✓</span>
            Được cộng đồng tin tưởng
          </div>
        </div>

        <button className="primary-button full">Mời chơi cùng</button>
      </div>
    </div>
  )
}
