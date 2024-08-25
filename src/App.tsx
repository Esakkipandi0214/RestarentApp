import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import RoleServices from './components/Services/RoleServices';

// Lazy load components
const LoginPage = lazy(() => import('./components/auth/loginpage'));
const RegisterPage = lazy(() => import('./components/auth/RegistrationPage'));
const MainDash = lazy(() => import('./components/Main/mainDash'));
const Profile = lazy(() => import('./components/AllCrendentialsProfile/Profile'));
const StatusVerificationTable = lazy(() => import('./components/Admin/StatusVerification'));
const AddMenuItem = lazy(() => import('./components/Admin/AddMenu'));
const Menu = lazy(() => import('./components/Admin/MenuView'));
const OrdersHistory = lazy(() => import('./components/Admin/OrdersHistory'));
const Orders = lazy(() => import('./components/chef/Orders'));
const Delivery = lazy(() => import('./components/Waiter/Delivery'));
const BillingOrders = lazy(() => import('./components/Admin/BiilingOrder'));

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div className="App">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              {RoleServices.isAdmin() && <><Route path="/dashboard" element={<MainDash />} /><Route path="/billing-orders" element={<BillingOrders />} /><Route path="/history-orders" element={<OrdersHistory />} /><Route path="/employee-verification" element={<StatusVerificationTable />} /><Route path="/add-menu" element={<AddMenuItem />} /></>}
              {RoleServices.isEmployee() && <Route path="/all-profile" element={<Profile />} />}
              <Route path="/view-menu/:tableName" element={<Menu />} />
              {RoleServices.isChef() && <Route path="/view-orders" element={<Orders />} />}
              {RoleServices.isWaiter() && <Route path="/delivery-orders" element={<Delivery />} />}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Suspense>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
