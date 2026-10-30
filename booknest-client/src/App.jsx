import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Books from './pages/Books';
import BookDetails from './pages/BookDetails';
import Reader from './pages/Reader';
import MyBooks from './pages/MyBooks';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/admin/Dashboard';
import AdminBooks from './pages/admin/AdminBooks';
import BookForm from './pages/admin/BookForm';
import Users from './pages/admin/Users';
import Categories from './pages/admin/Categories';
import Messages from './pages/admin/Messages';

function SiteLayout() {
  const { pathname } = useLocation();
  return (
    <>
      <Navbar />
      <Outlet />
      {!['/login', '/register', '/forgot-password'].includes(pathname) && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/my-books" element={<ProtectedRoute><MyBooks /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Route>
      <Route path="/read/:id" element={<ProtectedRoute><Reader /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute admin><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="books" element={<AdminBooks />} />
        <Route path="books/new" element={<BookForm />} />
        <Route path="books/:id/edit" element={<BookForm />} />
        <Route path="users" element={<Users />} />
        <Route path="categories" element={<Categories />} />
        <Route path="messages" element={<Messages />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route
        path="*"
        element={
          <div className="container section" style={{ textAlign: 'center', padding: '100px 0' }}>
            <span className="hero-pill" style={{ color: 'var(--forest-800)', borderColor: 'var(--forest-200)', background: 'var(--forest-50)' }}>404 Error</span>
            <h1 style={{ fontSize: '2.6rem', margin: '16px 0 8px' }}>Page Not Found</h1>
            <p className="muted" style={{ maxWidth: 440, margin: '0 auto 28px' }}>The literary page you are looking for does not exist in our library archives.</p>
            <a href="/" className="btn gold">Return to Library Home</a>
          </div>
        }
      />
    </Routes>
  );
}
