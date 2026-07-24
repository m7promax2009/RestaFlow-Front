import { FiInbox } from 'react-icons/fi'

export default function EmptyState({
    icon: Icon = FiInbox,
    title = 'Ma\'lumot topilmadi',
    description,
    action,
}) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <Icon className="h-10 w-10 text-gray-300 dark:text-gray-600" />
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</p>
            {description && (
                <p className="max-w-xs text-sm text-gray-400 dark:text-gray-500">{description}</p>
            )}
            {action && <div className="mt-2">{action}</div>}
        </div>
    )
}
