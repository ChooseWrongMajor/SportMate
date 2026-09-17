import type { Dispatch, SetStateAction } from 'react'

import { sports } from '../../data/mockData'
import type { NewMatchDraft } from '../../types'

type CreateMatchModalProps = {
  value: NewMatchDraft
  setValue: Dispatch<SetStateAction<NewMatchDraft>>
  onClose: () => void
  onCreate: () => void
}

export function CreateMatchModal({ value, setValue, onClose, onCreate }: CreateMatchModalProps) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal create-modal" onClick={(event) => event.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <span className="section-eyebrow">TẠO KÈO</span>

        <h2>Tạo một trận đấu mới.</h2>

        <p className="modal-description">
          Điền thông tin để những người chơi gần bạn có thể tìm thấy kèo.
        </p>

        <div className="form-grid">
          <label>
            Tên kèo
            <input
              value={value.title}
              onChange={(event) =>
                setValue((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              placeholder="Đá bóng tối thứ 7..."
            />
          </label>

          <label>
            Môn thể thao
            <select
              value={value.sport}
              onChange={(event) =>
                setValue((current) => ({ ...current, sport: event.target.value }))
              }
            >
              {sports
                .filter((sport) => sport.id !== 'all')
                .map((sport) => (
                  <option key={sport.id} value={sport.id}>
                    {sport.icon} {sport.name}
                  </option>
                ))}
            </select>
          </label>

          <label className="full">
            Địa điểm
            <input
              value={value.location}
              onChange={(event) =>
                setValue((current) => ({ ...current, location: event.target.value }))
              }
              placeholder="Sân bóng Linh Tây..."
            />
          </label>

          <label>
            Ngày
            <input
              type="date"
              value={value.date}
              onChange={(event) =>
                setValue((current) => ({ ...current, date: event.target.value }))
              }
            />
          </label>

          <label>
            Thời gian
            <input
              value={value.time}
              onChange={(event) =>
                setValue((current) => ({ ...current, time: event.target.value }))
              }
              placeholder="19:00 - 21:00"
            />
          </label>

          <label>
            Số người
            <input
              type="number"
              min="2"
              max="50"
              value={value.players}
              onChange={(event) =>
                setValue((current) => ({
                  ...current,
                  players: Number(event.target.value),
                }))
              }
            />
          </label>

          <label>
            Trình độ
            <select
              value={value.level}
              onChange={(event) =>
                setValue((current) => ({ ...current, level: event.target.value }))
              }
            >
              <option>Mọi trình độ</option>
              <option>Mới chơi</option>
              <option>Trung bình</option>
              <option>Khá</option>
              <option>Chuyên nghiệp</option>
            </select>
          </label>

          <label>
            Chi phí
            <input
              value={value.price}
              onChange={(event) =>
                setValue((current) => ({ ...current, price: event.target.value }))
              }
              placeholder="Miễn phí / 50.000đ"
            />
          </label>
        </div>

        <button className="primary-button full create-submit" onClick={onCreate}>
          Tạo kèo
        </button>
      </div>
    </div>
  )
}
