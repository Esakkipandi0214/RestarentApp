import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const LoginPage = lazy(() => import('./components/auth/loginpage'));
const RegisterPage = lazy(() => import('./components/auth/RegistrationPage'));
const MainDash = lazy(() => import('./components/Main/mainDash'));
const Profile = lazy(() => import('./components/AllCrendentialsProfile/Profile'));
const StatusVerificationTable = lazy(() => import('./components/Admin/StatusVerification'));
const Sidebar = lazy(() => import('./components/StaticComponents/sidebar'));
const AddMenuItem = lazy(() => import('./components/Admin/AddMenu'));
const Menu = lazy(() => import('./components/Admin/MenuView'));

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<MainDash />} />
            <Route path="/all-profile" element={<Profile />} />
            <Route path="/employee-verification" element={<StatusVerificationTable />} />
            <Route path="/sidebar" element={<Sidebar />} />
            <Route path="/add-menu" element={<AddMenuItem />} />
            <Route path="/view-menu" element={<Menu />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
