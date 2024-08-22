import React, { FC, useState } from 'react';
import { db, FirebaseError } from '../../firebase'; // Adjust the path according to your project structure
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import InfoCard from '../Reusables/SnackBar';

const SignUpForm: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>(''); // Initialize as an empty string or number
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setIsVisible(false);

    try {
      // Store user data in StatusVerification collection
      const userDocRef = doc(db, 'StatusVerification', email); // Use email as the document ID or change according to your needs
      await setDoc(userDocRef, {
        email,
        password, // Store the password (note: storing passwords in plaintext is not recommended for real-world applications)
        name,
        age,
        phoneNumber,
        status: 'Pending',
        createdAt: new Date()
      });

      // Show success message
      setTitle("Registration Successful");
      setDescription("Account information saved successfully! Please wait for verification.");
      setIsVisible(true);

      // Redirect to the dashboard or other page after successful registration
      window.location.href = '/'; // Or use router.push('/dashboard') if using next/router
    } catch (error) {
      setTitle("Failure");
      setDescription("Failed to save account information.");
      setIsVisible(true);
      const firebaseError = error as FirebaseError;
      setError(firebaseError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
  {/* InfoCard at the top of the page */}
  {isVisible && (
    <InfoCard 
      title={title || ""}
      children={description || ""}
      icon={
        title === "Registration Successful" ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-10 h-10 text-green-600">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.707-6.293a1 1 0 011.414 0L10 13.414l-1.707-1.707a1 1 0 011.414-1.414L10 10.586l1.707-1.707a1 1 0 111.414 1.414L11.414 10l1.707 1.707a1 1 0 010 1.414z" clipRule="evenodd"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-10 h-10 text-red-600">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1.707-6.293a1 1 0 01-1.414 0L10 13.414l-1.707-1.707a1 1 0 011.414-1.414L10 10.586l1.707-1.707a1 1 0 111.414 1.414L11.414 10l1.707 1.707a1 1 0 010 1.414z" clipRule="evenodd"></path>
          </svg>
        )
      }
    />
  )}
  <div className="flex flex-col max-w-md p-6 rounded-xl sm:p-12 bg-[#211951] shadow-lg border border-gray-200 dark:bg-gray-800 dark:text-gray-200">
    <div className="mb-8 text-center">
      <h1 className="my-3 text-4xl font-bold text-white">Sign Up</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">Create an account to access your dashboard</p>
    </div>
    <form noValidate onSubmit={handleSignUp} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 space-y-4 md:space-y-0">
        <div>
          <label htmlFor="name" className="block mb-2 text-sm text-gray-700 dark:text-gray-300">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="age" className="block mb-2 text-sm text-gray-700 dark:text-gray-300">Age</label>
          <input
            type="number"
            name="age"
            id="age"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            placeholder="30"
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block mb-2 text-sm text-gray-700 dark:text-gray-300">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="123-456-7890"
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-2 text-sm text-gray-700 dark:text-gray-300">Email address</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="md:col-span-2">
          <div className="flex justify-between mb-2">
            <label htmlFor="password" className="text-sm text-gray-700 dark:text-gray-300">Password</label>
            <a rel="noopener noreferrer" href="#" className="text-xs text-indigo-600 hover:underline dark:text-indigo-400">Forgot password?</a>
          </div>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="*****"
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="space-y-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full px-8 py-3 font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          {loading ? 'Saving information...' : 'Sign Up'}
        </button>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <p className="px-6 text-sm text-gray-600 text-center dark:text-gray-400">
          Already have an account? 
          <a rel="noopener noreferrer" href="/" className="text-indigo-600 hover:underline dark:text-indigo-400"> Sign in</a>.
        </p>
      </div>
    </form>
  </div>
</div>
  );
};

export default SignUpForm;
