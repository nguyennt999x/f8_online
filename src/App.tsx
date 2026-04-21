import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ProductPage from './pages/ProductPage';
import { isAuthenticated } from './plugins/axios';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isAuthenticated() ? '/products' : '/login'} replace />}
      />
      <Route
        path="/login"
        element={isAuthenticated() ? <Navigate to="/products" replace /> : <LoginPage />}
      />
      <Route element={<ProtectedRoute />}>
        <Route path="/products" element={<ProductPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
