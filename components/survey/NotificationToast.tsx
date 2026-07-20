import { AlertCircle, WifiOff } from 'lucide-react'

interface Notification {
  type: 'success' | 'error' | 'info'
  message: string
}

interface NotificationToastProps {
  notification: Notification | null
}

export function NotificationToast({ notification }: NotificationToastProps) {
  if (!notification) return null

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm font-bold flex items-center gap-2.5 animate-in slide-in-from-bottom-2 ${
        notification.type === 'success'
          ? 'bg-success text-white'
          : notification.type === 'error'
            ? 'bg-destructive text-white'
            : 'bg-amauta-blue-dark text-white'
      }`}
    >
      {notification.type === 'info' ? <WifiOff className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {notification.message}
    </div>
  )
}
