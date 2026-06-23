import { Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import { useBooking } from './context/BookingContext'
import { useSignOut } from './hooks/useSignOut'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import Services from './pages/Services'
import Testimonials from './pages/Testimonials'
import ContactUs from './pages/ContactUs'
import Login from './pages/Login'
import AdminLogin from './pages/AdminLogin'
import ChangePassword from './pages/ChangePassword'
import PatientPortal from './pages/PatientPortal'
import DoctorDashboard from './pages/DoctorDashboard'
import ReceptionistDashboard from './pages/ReceptionistDashboard'

const dockLinks = [
  { path: '/', name: 'Home', end: true },
  { path: '/about', name: 'About Us' },
  { path: '/services', name: 'Services' },
  { path: '/testimonials', name: 'Testimonials' },
  { path: '/contact', name: 'Contact Us' },
]

const fullWidthRoutes = [
  '/',
  '/about',
  '/services',
  '/testimonials',
  '/contact',
  '/admin/login',
  '/admin-login',
]

function MedicalCrossIcon() {
  return (
    <svg
      className="h-5 w-5 text-white"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function DockNavLink({ path, name, end = false }) {
  return (
    <NavLink
      to={path}
      end={end}
      className={({ isActive }) =>
        `group relative z-10 overflow-hidden rounded-xl px-4 py-2 text-sm font-bold transition-all duration-300 ${
          isActive ? 'text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`absolute bottom-0 left-0 top-0 -z-10 bg-gradient-to-r from-emerald-600 to-teal-600 transition-all duration-300 ease-out ${
              isActive ? 'w-full' : 'w-0 group-hover:w-full group-hover:opacity-[0.15]'
            }`}
          />
          <span className="relative">{name}</span>
        </>
      )}
    </NavLink>
  )
}

function App() {
  const location = useLocation()
  const { user } = useAuth()
  const { showToast } = useBooking()
  const signOut = useSignOut((message) => showToast(message, 'success'))
  const isInsidePortal = location.pathname.includes('/portal/')
  const isFullWidthPage =
    fullWidthRoutes.includes(location.pathname) ||
    location.pathname.startsWith('/portal/')

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-white/30 bg-white/70 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-3 transition-transform duration-200 hover:scale-[1.02]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-md shadow-emerald-500/20">
              <MedicalCrossIcon />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-900">
                DOCTOR<span className="text-emerald-600">CLINIC</span>
              </span>
              <span className="-mt-1 text-[10px] font-extrabold tracking-widest text-slate-400">
                PORTAL
              </span>
            </div>
          </Link>

          <div className="hidden items-center gap-1 rounded-2xl border border-slate-200/60 bg-slate-100/80 p-1.5 shadow-inner md:flex">
            {dockLinks.map((link) => (
              <DockNavLink key={link.path} {...link} />
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {!user ? (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-slate-100 text-teal-700'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/admin/login"
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-teal-800 text-white'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`
                  }
                >
                  Admin Login
                </NavLink>
              </>
            ) : (
              <>
                {isInsidePortal ? (
                  <span className="flex items-center gap-2 rounded-xl bg-slate-200/70 px-3 py-1.5 text-xs font-bold tracking-wide text-slate-700 shadow-inner">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                    Active {user.role} Portal
                  </span>
                ) : (
                  <Link
                    to={`/portal/${user.role.toLowerCase()}`}
                    className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-black tracking-wider text-white shadow-md transition hover:from-emerald-700 hover:to-teal-700"
                  >
                    Go to My Portal ({user.role})
                  </Link>
                )}
                <button
                  type="button"
                  onClick={signOut}
                  className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 shadow-sm transition hover:bg-red-100"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto border-t border-slate-200/50 bg-slate-100/60 px-4 py-2 backdrop-blur-md md:hidden">
          {dockLinks.map((link) => (
            <DockNavLink key={`mobile-${link.path}`} {...link} />
          ))}
        </div>
      </header>

      <main className={isFullWidthPage ? '' : 'mx-auto max-w-6xl px-6'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin-login" element={<Navigate to="/admin/login" replace />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route
            path="/portal/patient"
            element={
              <ProtectedRoute allowedRoles={['PATIENT']}>
                <PatientPortal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portal/doctor"
            element={
              <ProtectedRoute allowedRoles={['DOCTOR']}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portal/receptionist"
            element={
              <ProtectedRoute allowedRoles={['RECEPTIONIST']}>
                <ReceptionistDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
