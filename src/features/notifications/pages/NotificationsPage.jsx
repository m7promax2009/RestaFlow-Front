import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RefreshCw } from 'lucide-react'
import {
    fetchNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearAllNotifications,
} from '../notificationsSlice'
import { Badge, Button, EmptyState } from '../../../components/ui'
import { FiBell } from 'react-icons/fi'

export default function NotificationsPage() {
    const dispatch = useDispatch()
    const items = useSelector((state) => state.notifications.items)
    const loading = useSelector((state) => state.notifications.loading)
    const unreadCount = items.filter((item) => !item.read).length

    const handleRefresh = useCallback(() => {
        dispatch(fetchNotifications())
    }, [dispatch])

    const handleMarkAllRead = useCallback(() => {
        dispatch(markAllNotificationsRead())
    }, [dispatch])

    const handleClear = useCallback(() => {
        dispatch(clearAllNotifications())
    }, [dispatch])

    const handleNotificationClick = useCallback((item) => {
        if (!item.read) {
            dispatch(markNotificationRead(item._id ?? item.id))
        }
    }, [dispatch])

    return (
        <div className="p-4">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white">Bildirishnomalar</h1>
                    {unreadCount > 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{unreadCount} ta o'qilmagan</p>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={handleRefresh} disabled={loading}>
                        <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Yangilash
                    </Button>
                    <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                        Hammasini o'qilgan qilish
                    </button>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                        Tozalash
                    </button>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                    <EmptyState
                        icon={FiBell}
                        title="Hozircha bildirishnoma yo'q"
                        description="Yangi buyurtma tayyor bo'lganda shu yerda ko'rinadi."
                    />
                </div>
            ) : (
                <ul className="space-y-2">
                    {items.map((item) => (
                        <li
                            key={item._id ?? item.id}
                            onClick={() => handleNotificationClick(item)}
                            className={`flex items-center justify-between rounded-lg border px-4 py-3 transition dark:border-gray-700 ${
                                item.read
                                    ? 'bg-white dark:bg-gray-800'
                                    : 'cursor-pointer bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-950/50'
                            }`}
                        >
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {item.title ?? item.message}
                                </p>
                                {item.message && item.title && item.title !== item.message && (
                                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{item.message}</p>
                                )}
                                <p className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleString()}</p>
                            </div>
                            {!item.read && <Badge variant="info">Yangi</Badge>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
