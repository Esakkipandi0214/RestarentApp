import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../../firebase'; // Ensure Firebase app is initialized

const ProfileCard: React.FC = () => {
  const [profile, setProfile] = useState<{ displayName: string; imageUrl: string; role: string } | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const creditorId = localStorage.getItem('CreditorId');
        if (creditorId) {
          const docRef = doc(db, 'Creditors', creditorId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const profileData = docSnap.data() as { displayName: string; imageUrl: string; email?: string };

            const userEmail = profileData.email;

            if (userEmail) {
              // Fetch role from StatusVerification collection
              const roleDocRef = doc(db, 'StatusVerification', userEmail);
              const roleDocSnap = await getDoc(roleDocRef);

              const roleData = roleDocSnap.exists() ? (roleDocSnap.data() as { Role?: string }) : { Role: 'Unknown' };

              setProfile({
                ...profileData,
                role: roleData.Role || 'Unknown', // Default to 'Unknown' if role is not set
              });
            } else {
              setError('Email not found in profile data!');
            }
          } else {
            setError('No such document!');
          }
        }
      } catch (error) {
        setError((error as Error).message);
      }
    };

    fetchProfileData();
  }, [db]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const user = auth.currentUser;
      if (user && profile) {
        // Upload the file to Firebase Storage
        const storageRef = ref(storage, `profile-images/${file.name}`);
        await uploadBytes(storageRef, file);
        
        // Get the download URL
        const imageUrl = await getDownloadURL(storageRef);

        // Update Firestore document in Creditors collection with the new image URL
        const creditorId = localStorage.getItem('CreditorId');
        if (creditorId) {
          await setDoc(doc(db, 'Creditors', creditorId), { imageUrl }, { merge: true });
          setProfile((prev) => prev ? { ...prev, imageUrl } : null);
          setSuccess('Image updated successfully!');
        }
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center max-w-md p-6 shadow-md border rounded-3xl sm:px-12 bg-[#D6EFD8]">
      {profile && (
        <>
          <img
            src={profile.imageUrl}
            alt={profile.displayName}
            className="w-32 h-32 mx-auto rounded-full bg-[#EBF4F6] aspect-square"
          />
          <div className="space-y-4 text-center divide-y dark:divide-gray-300">
            <div className="my-2 space-y-1">
              <h2 className="text-xl font-semibold sm:text-2xl">{profile.displayName}</h2>
              <p className="text-lg font-medium">Role: {profile.role}</p>
            </div>
            <form onSubmit={handleImageUpload} className="mt-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="p-2 border rounded-md"
              />
              <button
                type="submit"
                disabled={loading}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                {loading ? 'Uploading...' : 'Upload Image'}
              </button>
            </form>
            {success && <p className="text-green-500 mt-2">{success}</p>}
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileCard;
