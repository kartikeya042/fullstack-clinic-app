import { Routes, Route, Link, useLocation } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
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

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/login', label: 'Login' },
  { to: '/admin-login', label: 'Admin Login' },
]

function App() {
  const location = useLocation()
  const isFullWidthPage =
    location.pathname === '/' || location.pathname.startsWith('/portal/') || location.pathname === '/admin-login'

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link to="/" className="text-xl font-semibold text-teal-700">
            Doctor Clinic
          </Link>
          <nav className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="transition hover:text-teal-700"
              >
                {label}
              </Link>
            ))}
          </nav>
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
          <Route path="/admin-login" element={<AdminLogin />} />
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
