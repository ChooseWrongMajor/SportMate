import { PlayerCard } from '../components/PlayerCard'
import type { Player } from '../types'

type PlayersPageProps = {
  players: Player[]
  setSelectedPlayer: (player: Player) => void
}

export function PlayersPage({ players, setSelectedPlayer }: PlayersPageProps) {
  return (
    <main className="page">
      <div className="container">
        <div className="page-heading">
          <span className="section-eyebrow">CỘNG ĐỒNG SPORTMATE</span>

          <h1>Tìm người chơi cùng bạn.</h1>

          <p>
            Xem hồ sơ, trình độ và điểm uy tín trước khi chơi cùng một người mới.
          </p>
        </div>

        <div className="player-toolbar">
          <div className="large-search">
            <span>⌕</span>
            <input placeholder="Tìm người chơi..." />
          </div>

          <select>
            <option>Tất cả môn thể thao</option>
            <option>Bóng đá</option>
            <option>Cầu lông</option>
            <option>Bóng rổ</option>
            <option>Tennis</option>
            <option>Bida</option>
          </select>

          <select>
            <option>Gần tôi nhất</option>
            <option>Uy tín cao nhất</option>
            <option>Chơi nhiều nhất</option>
          </select>
        </div>

        <div className="player-grid player-grid-page">
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} onClick={() => setSelectedPlayer(player)} />
          ))}
        </div>
      </div>
    </main>
  )
}
