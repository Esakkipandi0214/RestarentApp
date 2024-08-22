import './App.css';
import LoginPage from './components/auth/loginpage';
import ResgisterPage from './components/auth/RegistrationPage'
import MainDash from './components/Main/mainDash';
import Profile from './components/AllCrendentialsProfile/Profile'
import StatusVerificationTalbe from './components/Admin/StatusVerification'
import Sidebar from './components/StaticComponents/sidebar';
import AddMenuItem from './components/Admin/AddMenu';
import Menu from './components/Admin/MenuView';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<ResgisterPage />} />
          <Route path="/dashbaord" element={<MainDash />}/>
          <Route path="/all-profile" element={<Profile />}/>
          <Route path="/Employee-verification" element={<StatusVerificationTalbe />}/>
          <Route path="/sidebar" element={<Sidebar />}/>
          <Route path="/add-Menu" element={<AddMenuItem />}/>
          <Route path="/View-Menu" element={<Menu />}/>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
