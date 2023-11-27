import { collection, query, where, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";

export const useEditPrint = () => {
  const editPrint = async ({ print_id, print_name, print_url, print_tags }) => {
    try {
      const q = query(collection(db, "prints"), where("print_id", "==", print_id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const printDoc = querySnapshot.docs[0];
        await updateDoc(printDoc.ref, {
          print_name: print_name,
          print_url: print_url,
          print_tags: print_tags,
          updatedAt: serverTimestamp(),
        });
        console.log(`Print actualizada: ${printDoc.id}`);
      } else {
        console.error(`No se encontró ninguna print con id ${print_id}.`);
      }
    } catch (error) {
      console.error('Error al editar print:', error);
    }
  };

  return { editPrint };
};