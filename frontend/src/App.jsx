import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import CustomerLayout from './layouts/CustomerLayout';

// Customer Pages
import Home from './pages/Home';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import ContactUs from './pages/ContactUs';
import BulkOrder from './pages/BulkOrder';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import MangoManager from './admin/MangoManager';
import OrderManager from './admin/OrderManager';
import CustomerManager from './admin/CustomerManager';
import SubscriptionManager from './admin/SubscriptionManager';
import CouponManager from './admin/CouponManager';
import ReviewManager from './admin/ReviewManager';
import BannerManager from './admin/BannerManager';
import BulkOrderManager from './admin/BulkOrderManager';
import ContactMessageManager from './admin/ContactMessageManager';
import AdminLayout from './admin/AdminLayout';

import ScrollToTop from './components/ScrollToTop';

const AdminRoute = ({ children }) => {
  const { dbUser, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="w-8 h-8 border-2 border-mango-500 border-t-transparent rounded-full animate-spin" /></div>;
  return dbUser?.role === 'admin' ? children : <Navigate to="/admin-login" />;
};

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Customer Application — Wrapped in CustomerLayout */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<Store />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/track" element={<OrderTracking />} />
          <Route path="/track/:orderId" element={<OrderTracking />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/bulk-order" element={<BulkOrder />} />

          {/* Unused customer routes redirected to home */}
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/profile" element={<Navigate to="/" />} />
          <Route path="/referral" element={<Navigate to="/" />} />
        </Route>

        {/* Admin Login — Plain Page */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin Panel — Completely Separate Layout */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="mangoes" element={<MangoManager />} />
          <Route path="orders" element={<OrderManager />} />
          <Route path="bulk-orders" element={<BulkOrderManager />} />
          <Route path="contacts" element={<ContactMessageManager />} />
          <Route path="customers" element={<CustomerManager />} />
          <Route path="coupons" element={<CouponManager />} />
          <Route path="reviews" element={<ReviewManager />} />
          <Route path="banners" element={<BannerManager />} />
        </Route>

        {/* 404 — Redirect to Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
