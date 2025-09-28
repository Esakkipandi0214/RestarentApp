// src/components/auth/DemoLoginPage.tsx
import React, { FC, useState, useCallback } from 'react';
import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import InfoCard from '../Reusables/SnackBar';
import Cookies from 'js-cookie';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { BeatLoader } from 'react-spinners';
import DemoQr from '../../../public/QrTables/table05Live.png';
// import {useNavigate} from 'react-router-dom'

const DemoLoginPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'Admin' | 'Chef' | 'Waiter'>('Admin');
  const [showQr, setShowQr] = useState(false);

//   const navigate = useNavigate()

  const demoAccounts = {
    Admin: {
      email: import.meta.env.VITE_DEMO_ADMIN_EMAIL!,
      password: import.meta.env.VITE_DEMO_ADMIN_PASSWORD!,
    },
    Chef: {
      email: import.meta.env.VITE_DEMO_CHEF_EMAIL!,
      password: import.meta.env.VITE_DEMO_CHEF_PASSWORD!,
    },
    Waiter: {
      email: import.meta.env.VITE_DEMO_WAITER_EMAIL!,
      password: import.meta.env.VITE_DEMO_WAITER_PASSWORD!,
    },
  };

  const handleshowQr = useCallback((Status:boolean)=>()=> setShowQr(Status),[])

   const handleDemoLogin = async () => {
    setLoading(true);
    setIsVisible(false);

    const { email, password } = demoAccounts[selectedRole];

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      localStorage.setItem('authToken', token);
      Cookies.set('authToken', token, { expires: 7 });
      localStorage.setItem('CreditorId', user.uid);

      const docRef = doc(db, 'Creditors', user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, { email, name: '', phone: '' });
      }

      const RoleCollection = doc(db, 'StatusVerification', email);
      const RoleSnapshot = await getDoc(RoleCollection);
      if (RoleSnapshot.exists()) {
        const RoleData = RoleSnapshot.data().Role;
        localStorage.setItem('Restaurentrole', RoleData);
      }

      setTitle('Success');
      setDescription(`${selectedRole} logged in successfully!`);
      setIsVisible(true);
    window.location.href ='/all-profile';
    } catch (error) {
      console.error(error);
      setTitle('Failure');
      setDescription('Demo login failed. Please try again.');
      setIsVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-800 via-indigo-700 to-blue-900 p-4">
      {isVisible && (
        <InfoCard 
          title={title || ''} 
          children={
            <div className="flex items-center space-x-2">
              {title === 'Success' ? (
                <FaCheckCircle className="text-green-400" />
              ) : (
                <FaTimesCircle className="text-red-500" />
              )}
              <span>{description}</span>
            </div>
          } 
        />
      )}

      {/* Show QR after login */}
      {showQr ? (
        <div className="w-full max-w-md p-6 rounded-3xl bg-white/95 backdrop-blur-md shadow-2xl border border-yellow-400 flex flex-col items-center space-y-6">
          <h2 className="text-2xl font-bold text-purple-800 text-center">
            Scan to Start Ordering 🍽️
          </h2>
          <img src={DemoQr} alt="Demo QR Code" className="w-48 h-48 rounded-xl shadow-md border-4 border-yellow-400" />
          <p className="text-center text-gray-700">Use your phone camera to scan the QR and explore the demo ordering system.</p>
          {/* <button
            onClick={() => (window.location.href = '/view-menu/table05')}
            className="px-6 py-3 font-bold rounded-xl bg-yellow-400 text-purple-900 hover:bg-yellow-500"
          >
            Continue to Menu
          </button> */}
            <button
            onClick={handleshowQr(false)}
            className="px-6 py-3 font-bold rounded-xl bg-yellow-400 text-purple-900 hover:bg-yellow-500"
          >
            DashDemo
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md p-8 space-y-6 rounded-3xl bg-white/95 backdrop-blur-md shadow-2xl border border-yellow-400">
          <h1 className="text-4xl font-extrabold text-center text-purple-800">Demo Login</h1>
          <p className="text-center text-gray-700 mb-4">
            Select a role to log in instantly with demo credentials
          </p>

          {/* Role Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
  {Object.keys(demoAccounts).map((role) => (
    <button
      key={role}
      onClick={() => setSelectedRole(role as 'Admin' | 'Chef' | 'Waiter')}
      className={`w-full px-4 py-2 rounded-xl font-semibold border-2 transition-colors duration-300 
        ${selectedRole === role
          ? 'bg-yellow-400 text-purple-900 border-yellow-500'
          : 'bg-white text-purple-700 border-purple-300 hover:bg-yellow-300'
        }`}
    >
      {role}
    </button>
  ))}

  <button
    onClick={handleshowQr(true)}
    className="w-full px-4 py-2 rounded-xl font-semibold border-2 transition-colors duration-300 
               bg-white text-purple-700 border-purple-300 hover:bg-yellow-300"
  >
    User
  </button>
</div>


          {/* Login Button */}
          <button
            disabled={loading}
            onClick={handleDemoLogin}
            className="w-full px-4 py-3 mt-4 font-bold rounded-xl bg-yellow-400 text-purple-900 hover:bg-yellow-500 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <BeatLoader size={8} color="#4B0082" />
                <span>Logging in...</span>
              </>
            ) : (
              <span>Login as {selectedRole}</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default DemoLoginPage;
