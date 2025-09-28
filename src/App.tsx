import { lazy ,Suspense} from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import RoleServices from './components/Services/RoleServices';
import LoaderWrapper from './components/UI/LoaderWrapper';
import FoodLoader from './components/UI/FoodLoader';
import DeviceGuard from './components/Services/DeviceGuard';


// Lazy load components
const LoginPage = lazy(() => import('./components/auth/DemoLoginPage'));
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
          <Suspense fallback={<FoodLoader/>}>
          <LoaderWrapper delay={1000}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/view-menu/:tableName" element={<Menu />} />
              <Route path="*" element={<Navigate to="/login" />} />
               {/* Desktop-only routes */}
  <Route element={<DeviceGuard />}>
    {RoleServices.isAdmin() && (
      <>
        <Route path="/dashboard" element={<MainDash />} />
        <Route path="/billing-orders" element={<BillingOrders />} />
        <Route path="/history-orders" element={<OrdersHistory />} />
        <Route
          path="/employee-verification"
          element={<StatusVerificationTable />}
        />
        <Route path="/add-menu" element={<AddMenuItem />} />
      </>
    )}
    {RoleServices.isEmployee() && (
      <Route path="/all-profile" element={<Profile />} />
    )}
    {RoleServices.isChef() && (
      <Route path="/view-orders" element={<Orders />} />
    )}
    {RoleServices.isWaiter() && (
      <Route path="/delivery-orders" element={<Delivery />} />
    )}
  </Route>

            </Routes>
            </LoaderWrapper>
          </Suspense>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
