import type { Match, Message } from '../../types'

type ChatModalProps = {
  match: Match
  messages: Message[]
  message: string
  setMessage: (value: string) => void
  onSend: () => void
  onClose: () => void
}

export function ChatModal({ match, messages, message, setMessage, onSend, onClose }: ChatModalProps) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="chat-modal" onClick={(event) => event.stopPropagation()}>
        <div className="chat-header">
          <div className="chat-title">
            <span>{match.icon}</span>

            <div>
              <strong>{match.title}</strong>
              <small>{match.players} người tham gia</small>
            </div>
          </div>

          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((item) => (
            <div key={item.id} className={item.mine ? 'message-row mine' : 'message-row'}>
              {!item.mine && <span className="message-avatar">{item.initials}</span>}

              <div className="message-content">
                {!item.mine && <small>{item.sender}</small>}

                <p>{item.text}</p>

                <span>{item.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="chat-composer">
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                onSend()
              }
            }}
            placeholder="Viết tin nhắn..."
          />

          <button onClick={onSend}>↑</button>
        </div>
      </div>
    </div>
  )
}
