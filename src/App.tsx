import './App.css';
import LoginPage from './components/auth/loginpage';
import RegisterPage from './components/auth/RegistrationPage'; // Fixed spelling
import MainDash from './components/Main/mainDash'; // Fixed capitalization
import Profile from './components/AllCrendentialsProfile/Profile'; // Fixed spelling
import StatusVerificationTable from './components/Admin/StatusVerification'; // Fixed spelling
import Sidebar from './components/StaticComponents/sidebar'; // Fixed capitalization
import AddMenuItem from './components/Admin/AddMenu';
import Menu from './components/Admin/MenuView';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/register" element={<RegisterPage />} /> {/* Fixed spelling */}
          <Route path="/dashboard" element={<MainDash />} /> {/* Fixed spelling */}
          <Route path="/all-profile" element={<Profile />} />
          <Route path="/employee-verification" element={<StatusVerificationTable />} /> {/* Fixed spelling */}
          <Route path="/sidebar" element={<Sidebar />} />
          <Route path="/add-menu" element={<AddMenuItem />} /> {/* Fixed spelling */}
          <Route path="/view-menu" element={<Menu />} /> {/* Fixed spelling */}
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
