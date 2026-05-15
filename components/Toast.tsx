'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (message: string, type?: ToastType) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => removeToast(id), 4000)
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  if (toasts.length === 0) return null

  const icons: Record<ToastType, ReactNode> = {
    success: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M6 10l3 3 5-5" stroke="#7AE6D0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    error: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 6v4M10 14h.01M12 2l8 16H4L12 2z" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    info: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><circle cx="10" cy="10" r="8" stroke="#8CAEFF" strokeWidth="1.5"/><path d="M10 9v5M10 7v.01" stroke="#8CAEFF" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    warning: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 2L1.5 18h17L10 2zM10 8v4M10 14h.01" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  }

  const bg: Record<ToastType, string> = {
    success: 'border-[#7AE6D0]/30 bg-[#7AE6D0]/5',
    error: 'border-[#EF4444]/30 bg-[#EF4444]/5',
    info: 'border-[#8CAEFF]/30 bg-[#8CAEFF]/5',
    warning: 'border-[#F59E0B]/30 bg-[#F59E0B]/5',
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-xl border backdrop-blur-md shadow-2xl ${bg[toast.type]} animate-[slideIn_0.3s_ease-out]`}
          style={{ animation: 'slideIn 0.3s ease-out' }}
        >
          {icons[toast.type]}
          <span className="text-white/90 text-sm font-medium">{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="ml-2 text-white/30 hover:text-white/60 transition-colors">
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
      ))}
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}