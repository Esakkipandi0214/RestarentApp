import React, { FC, useState } from 'react';
import { auth, db } from '../../firebase'; // Adjust the path according to your project structure
import { signInWithEmailAndPassword } from 'firebase/auth';
import InfoCard from '../Reusables/SnackBar';
import Cookies from 'js-cookie';
import { doc, getDoc, setDoc } from 'firebase/firestore';


const LoginForm: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setIsVisible(false);

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const token = await user.getIdToken(); // Get the ID token
  
        // Store token in local storage
        localStorage.setItem('authToken', token);
  
        // Store token in cookies
        Cookies.set('authToken', token, { expires: 7 }); // Set cookie expiration as needed

        // Check if the email exists in the Creditors collection
    const docRef = doc(db, 'Creditors', user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // If the document does not exist, create a new profile with email and empty fields
      await setDoc(docRef, {
        email: email,
        name: '',
        phone: ''
      });
    }
    // Store token in local storage
    localStorage.setItem('CreditorId', user.uid);
    
      setTitle("Success");
      setDescription("Logged in successfully!");
      setIsVisible(true);
      // Redirect to the dashboard or other page after successful sign-in
      window.location.href ='/dashboard';
    } catch (error) {
        setTitle("Failure");
      setDescription("Login failed. Please check your email and password.");
      setIsVisible(true);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
    {/* InfoCard at the top of the page */}
    {isVisible && (
        <InfoCard 
          title={title || ""}
          children={description || ""}
          icon={
            title === "Success" ? (
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
      <div className="w-full max-w-md p-8 space-y-6 rounded-lg bg-white shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-900">Login</h1>
        <form noValidate onSubmit={handleSignIn} className="space-y-6">
          <div className="space-y-1 text-sm">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-md border border-gray-300 bg-gray-50 text-gray-800 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="space-y-1 text-sm">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-md border border-gray-300 bg-gray-50 text-gray-800 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
            <div className="flex justify-end text-xs text-gray-600">
              <a href="#" rel="noopener noreferrer">Forgot Password?</a>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
        <p>Dont&apos; have an Accout? <a href="/register" className=' underline text-blue-500'>signup</a></p>
        <div className="flex items-center pt-4 space-x-1">
          <div className="flex-1 h-px bg-gray-300"></div>
          <p className="px-3 text-sm text-gray-600">Login with social accounts</p>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
        <div className="flex justify-center space-x-4">
          <button aria-label="Log in with Google" className="p-3 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
              <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
            </svg>
          </button>
          <button aria-label="Log in with Twitter" className="p-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
              <path d="M31.937 6.093c-1.177 0.516-2.437 0.871-3.765 1.032 1.355-0.813 2.391-2.099 2.885-3.631-1.271 0.74-2.677 1.276-4.172 1.579-1.192-1.276-2.896-2.079-4.787-2.079-3.625 0-6.563 2.937-6.563 6.557 0 0.521 0.063 1.021 0.172 1.495-5.453-0.255-10.287-2.875-13.52-6.833-0.568 0.964-0.891 2.084-0.891 3.303 0 2.281 1.161 4.281 2.916 5.457-1.073-0.031-2.083-0.328-2.968-0.817v0.079c0 3.181 2.26 5.833 5.26 6.437-0.547 0.145-1.131 0.229-1.724 0.229-0.421 0-0.823-0.041-1.224-0.115 0.844 2.604 3.26 4.5 6.14 4.557-2.239 1.755-5.077 2.801-8.135 2.801-0.521 0-1.041-0.025-1.563-0.088 2.917 1.86 6.36 2.948 10.079 2.948 12.067 0 18.661-9.995 18.661-18.651 0-0.276 0-0.557-0.021-0.839 1.287-0.917 2.401-2.079 3.281-3.396z"></path>
            </svg>
          </button>
          <button aria-label="Log in with GitHub" className="p-3 text-white bg-gray-800 rounded-md hover:bg-gray-900 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
              <path d="M16 0.396c-8.839 0-16 7.167-16 16 0 7.073 4.584 13.068 10.937 15.183 0.803 0.151 1.093-0.344 1.093-0.772 0-0.38-0.009-1.385-0.015-2.719-4.453 0.964-5.391-2.151-5.391-2.151-0.729-1.844-1.781-2.339-1.781-2.339-1.448-0.989 0.115-0.968 0.115-0.968 1.604 0.109 2.448 1.645 2.448 1.645 1.427 2.448 3.741 1.738 4.665 1.338 0.144-1.021 0.558-1.738 1.08-2.137-3.772-0.431-7.734-1.887-7.734-8.399 0-1.855 0.663-3.37 1.767-4.566-0.177-0.428-0.768-2.133-0.167-4.451 0 0 1.364-0.437 4.47 1.651 1.365-0.379 2.828-0.572 4.286-0.582 1.448 0.01 2.925 0.199 4.307 0.582 3.105-2.087 4.471-1.651 4.471-1.651 0.604 2.318 0.009 4.023-0.176 4.451 1.106 1.196 1.767 2.711 1.767 4.566 0 6.525-3.987 7.963-7.782 8.388 0.574 0.495 1.083 1.472 1.083 2.978 0 2.149-0.021 3.876-0.021 4.401 0 0.428 0.287 0.929 1.093 0.772 6.355-2.11 10.939-8.093 10.939-15.166 0-8.833-7.161-16-16-16z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
