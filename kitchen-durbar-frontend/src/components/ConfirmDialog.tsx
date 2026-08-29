import { useLanguage } from '../context/LanguageContext'

type ConfirmDialogProps = {
  open: boolean
  title?: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  const { t } = useLanguage()

  return (
    <div className={`kd-mo${open ? ' active' : ''}`}>
      <div className="kd-md" style={{ maxWidth: 360 }}>
        <h3>{title ?? t('common.confirm')}</h3>
        <p style={{ marginBottom: 24, color: 'var(--ktm)' }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="kd-btn kd-btn-o" style={{ padding: '10px 20px', fontSize: 14 }} onClick={onCancel}>
            {cancelLabel ?? t('common.cancel')}
          </button>
          <button className="kd-btn kd-btn-p" style={{ padding: '10px 20px', fontSize: 14 }} onClick={onConfirm}>
            {confirmLabel ?? t('common.confirm')}
          </button>
        </div>
      </div>
    </div>
  )
}
