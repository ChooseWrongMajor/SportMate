import type { Notification } from '../types'

type NotificationPanelProps = {
  notifications: Notification[]
  onRead: () => void
}

export function NotificationPanel({ notifications, onRead }: NotificationPanelProps) {
  return (
    <div className="notification-panel">
      <div className="notification-heading">
        <div>
          <span className="section-eyebrow">THÔNG BÁO</span>
          <h3>Hoạt động gần đây</h3>
        </div>

        <button onClick={onRead}>Đánh dấu đã đọc</button>
      </div>

      <div>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={notification.unread ? 'notification-item unread' : 'notification-item'}
          >
            <span className="notification-icon">{notification.unread ? '●' : '○'}</span>

            <div>
              <strong>{notification.title}</strong>
              <p>{notification.text}</p>
              <small>{notification.time}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
