import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import GplxExamPage from './pages/GplxExamPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import OrdersDashboardPage from './pages/OrdersDashboardPage';
import ProductPage from './pages/ProductPage';
import { isAuthenticated } from './plugins/axios';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/gplx-exam" element={<GplxExamPage />} />
      <Route path="/orders-dashboard" element={<OrdersDashboardPage />} />
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
