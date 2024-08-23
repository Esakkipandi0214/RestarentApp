// services/accountService.ts
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../../firebase'; // Adjust the path according to your project structure
import { doc, updateDoc } from 'firebase/firestore';

const auth = getAuth();

interface CreateAccountParams {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
}

export const createAccount = async ({ email, password, name, phoneNumber }: CreateAccountParams) => {
  try {
    // Create a new user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Extract user UID from the credentials
    const { user } = userCredential;
    console.log(user)
    // Update Firestore with the additional user information
    const userRef = doc(db, 'StatusVerification', email); // Assuming 'StatusVerification' uses UID as document ID
    await updateDoc(userRef, {
      name,
      phoneNumber,
      status: 'approved' // or any other status update as needed
    });

    console.log('Account created successfully for', email);
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
};
