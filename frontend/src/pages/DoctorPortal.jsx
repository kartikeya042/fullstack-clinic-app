import { useAuth } from '../context/AuthContext'

function DoctorPortal() {
  const { user, logout } = useAuth()

  return (
    <div className="py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-800">Doctor Portal</h1>
        <p className="mt-4 text-slate-600">Signed in as {user?.email}.</p>
        <button
          type="button"
          onClick={logout}
          className="mt-6 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default DoctorPortal
