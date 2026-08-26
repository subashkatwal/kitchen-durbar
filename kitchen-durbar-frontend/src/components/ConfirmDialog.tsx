type ConfirmDialogProps = {
  open: boolean
  title?: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title = 'Please confirm',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className={`kd-mo${open ? ' active' : ''}`}>
      <div className="kd-md" style={{ maxWidth: 360 }}>
        <h3>{title}</h3>
        <p style={{ marginBottom: 24, color: 'var(--ktm)' }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="kd-btn kd-btn-o" style={{ padding: '10px 20px', fontSize: 14 }} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="kd-btn kd-btn-p" style={{ padding: '10px 20px', fontSize: 14 }} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
