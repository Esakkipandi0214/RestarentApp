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
          <Route path="https://restarent-app.vercel.app/register" element={<RegisterPage />} /> {/* Fixed spelling */}
          <Route path="https://restarent-app.vercel.app/dashboard" element={<MainDash />} /> {/* Fixed spelling */}
          <Route path="https://restarent-app.vercel.app/all-profile" element={<Profile />} />
          <Route path="https://restarent-app.vercel.app/employee-verification" element={<StatusVerificationTable />} /> {/* Fixed spelling */}
          <Route path="https://restarent-app.vercel.app/sidebar" element={<Sidebar />} />
          <Route path="https://restarent-app.vercel.app/add-menu" element={<AddMenuItem />} /> {/* Fixed spelling */}
          <Route path="https://restarent-app.vercel.app/view-menu" element={<Menu />} /> {/* Fixed spelling */}
          <Route path="*" element={<Navigate to="https://restarent-app.vercel.app/login" />} />
          <Route path="https://restarent-app.vercel.app/login" element={<LoginPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
