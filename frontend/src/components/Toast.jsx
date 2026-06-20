function Toast({ message, type = 'success', onClose }) {
  if (!message) return null

  const styles =
    type === 'success'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : 'border-red-200 bg-red-50 text-red-800'

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed right-4 top-4 z-[100] flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${styles}`}
    >
      <span className="mt-0.5 text-lg" aria-hidden="true">
        {type === 'success' ? '✓' : '!'}
      </span>
      <p className="flex-1 text-sm font-medium leading-relaxed">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="rounded-md p-1 opacity-70 transition hover:opacity-100"
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  )
}

export default Toast
