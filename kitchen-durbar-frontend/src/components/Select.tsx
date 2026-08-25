import { useEffect, useRef, useState } from 'react'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
}

/**
 * A dropdown styled like a native <select> (.kd-sl) but rendered entirely in
 * CSS we control. Native <select> popups are drawn by the OS/browser outside
 * normal layout - on some mobile browsers that popup can render wider than
 * the viewport and cause horizontal overflow. This menu is just an absolutely
 * positioned div pinned to the trigger's own width (left:0; right:0), so it
 * can never be wider than its trigger and never escapes the page.
 */
export default function Select({ value, onChange, options, placeholder, className }: SelectProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDocPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onDocPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onDocPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const current = options.find((o) => o.value === value)

  return (
    <div className={`kd-select${className ? ` ${className}` : ''}`} ref={rootRef}>
      <button
        type="button"
        className="kd-sl kd-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{current ? current.label : placeholder}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="kd-select-menu" role="listbox">
          {options.map((o) => (
            <div
              key={o.value || '__empty'}
              role="option"
              aria-selected={o.value === value}
              className={`kd-select-opt${o.value === value ? ' active' : ''}`}
              onClick={() => {
                onChange(o.value)
                setOpen(false)
              }}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
