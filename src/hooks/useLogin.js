// useLogin.js
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase-config';

export const useLogin = () => {
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const id = userDoc.data().user_id;
        const admin = userDoc.data().admin;

        return {
          id: id,
          admin: admin,
        };
      } else {
        throw new Error('Error: No se encontró el documento del usuario');
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      setError(error.message || 'Error durante el inicio de sesión');
      throw error;
    }
  };

  return { login, error };
};