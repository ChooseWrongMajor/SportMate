type SectionHeaderProps = {
  eyebrow: string
  title: string
  description: string
  action?: string
  onAction?: () => void
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  onAction,
}: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div>
        <span className="section-eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      {action && (
        <button className="text-button" onClick={onAction}>
          {action} →
        </button>
      )}
    </div>
  )
}
