import React, { FC, useState, useEffect } from 'react';
import {
  getAuth,
  updateProfile,
  updateEmail,
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider,
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { app } from '../../firebase'; // Ensure Firebase app is initialized
import Layout from '../StaticComponents/layout';


const UpdateProfile: FC = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getFirestore(app);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const creditorId = localStorage.getItem('CreditorId'); // Retrieve CreditorId from local storage
        if (creditorId) {
          const docRef = doc(db, 'Creditors', creditorId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setName(data.displayName || '');
            setEmail(data.email || '');
            setPhone(data.phone || '');
            setAddress(data.address || '');
            setAge(data.age || '');
          } else {
            console.log('No such document!');
          }
        }
      } catch (error) {
        setError((error as Error).message);
      }
    };

    fetchProfileData();
  }, [db]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (user) {
        const updates: any = {};

        // Update name if changed
        if (name !== user.displayName) {
          await updateProfile(user, { displayName: name });
          updates.displayName = name;
        }

        // Update email if changed
        if (email !== user.email) {
          await reauthenticateUser(user, password);
          await updateEmail(user, email);
          updates.email = email;
        }

        // Collect other updates
        if (phone) updates.phone = phone;
        if (address) updates.address = address;
        if (age) updates.age = age;

        // Update Firestore document in Creditors collection if there are changes
        const creditorId = localStorage.getItem('CreditorId');
        if (creditorId && Object.keys(updates).length > 0) {
          await setDoc(doc(db, 'Creditors', creditorId), updates, { merge: true });
        }

        setSuccess('Profile updated successfully!');
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
      setIsEditMode(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (user) {
        await reauthenticateUser(user, password);
        await updatePassword(user, newPassword);
        setSuccess('Password updated successfully!');
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const reauthenticateUser = async (user: any, password: string) => {
    const credential = EmailAuthProvider.credential(user.email || '', password);
    return reauthenticateWithCredential(user, credential);
  };

  return (
    <Layout>
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
     <header className="bg-indigo-600 text-white p-4 rounded-md shadow-md flex justify-between items-center">
     <h1 className="text-2xl font-bold">Update Your Profile</h1>
</header>
      <main className="mt-8">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md p-6 dark:bg-gray-800">
          <h2 className="text-4xl text-blue-700 font-semibold mb-4">Profile</h2>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <form onSubmit={handleProfileUpdate} className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                disabled={!isEditMode}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@example.com"
                disabled={!isEditMode}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm text-gray-700 dark:text-gray-300">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="123-456-7890"
                disabled={!isEditMode}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm text-gray-700 dark:text-gray-300">
                Address
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, City, Country"
                disabled={!isEditMode}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="age" className="block text-sm text-gray-700 dark:text-gray-300">
                Age
              </label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                placeholder="30"
                disabled={!isEditMode}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm text-gray-700 dark:text-gray-300">
                Current Password (required to update email)
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                disabled={!isEditMode}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="col-span-full">
              <button
                type="button"
                onClick={() => setIsEditMode(!isEditMode)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {isEditMode ? 'Cancel' : 'Edit'}
              </button>
            </div>
            {isEditMode && (
              <div className="col-span-full">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            )}
          </form>

          {isEditMode && (
            <form onSubmit={handlePasswordChange} className="mt-8 space-y-6">
              <h2 className="text-xl font-semibold mb-4">Change Password</h2>
              <div>
                <label htmlFor="newPassword" className="block text-sm text-gray-700 dark:text-gray-300">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="********"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="col-span-full">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Change Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
    </Layout>
  );
};

export default UpdateProfile;
