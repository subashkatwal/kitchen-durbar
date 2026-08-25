import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'

type ToastFn = (message: string) => void

const ToastContext = createContext<ToastFn | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('')
  const [show, setShow] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  const toast = useCallback<ToastFn>((msg) => {
    setMessage(msg)
    setShow(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setShow(false), 2500)
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className={`kd-toast${show ? ' show' : ''}`}>{message}</div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
