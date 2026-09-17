export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand">
            <span className="brand-mark">S</span>
            <span>
              Sport<span>Mate</span>
            </span>
          </div>

          <p>
            Tìm người chơi.
            <br />
            Tìm trận đấu.
            <br />
            Chơi nhiều hơn.
          </p>
        </div>

        <div>
          <strong>SportMate</strong>
          <a href="#home">Trang chủ</a>
          <a href="#matches">Tìm kèo</a>
          <a href="#players">Người chơi</a>
        </div>

        <div>
          <strong>Cộng đồng</strong>
          <a href="#about">Về SportMate</a>
          <a href="#rules">Quy tắc cộng đồng</a>
          <a href="#safety">An toàn</a>
        </div>

        <div>
          <strong>Hỗ trợ</strong>
          <a href="#help">Trung tâm trợ giúp</a>
          <a href="#contact">Liên hệ</a>
          <a href="#privacy">Quyền riêng tư</a>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© 2026 SportMate</span>
        <span>Made for people who love sports.</span>
      </div>
    </footer>
  )
}
