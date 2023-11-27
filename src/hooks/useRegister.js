import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, collection, serverTimestamp, query, where, getDocs, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase-config';

export const useRegister = () => {
  const [error, setError] = useState(null);

  const register = async ({ email, password }) => {
    try {
      const usersCollection = collection(db, 'users');
      const emailQuery = query(usersCollection, where('email', '==', email));
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty) {
        throw new Error('Ya existe un usuario con este correo electrónico');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(usersCollection, user.uid), {
        user_id: user.uid,
        email: email,
        admin: false,
        printsOwned: [],
        printsWanted: [],
        createdAt: serverTimestamp(),
      });

      setError(null);

      return user;
    } catch (error) {
      console.error('Error durante el registro:', error);
      setError(error.message || 'Error durante el registro');
      throw error;
    }
  };

  return { register, error };
};
