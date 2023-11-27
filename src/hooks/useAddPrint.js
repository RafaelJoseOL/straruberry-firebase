import { addDoc, collection, serverTimestamp, doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "../config/firebase-config"

export const useAddPrint = () => {
    const printsCollection = collection(db, "prints");

    const addPrint = async ( {print_name, print_url, print_tags} ) => {
        const lastPrintDoc = await getDoc(doc(db, "metadata", "prints"));
        const lastPrintID = lastPrintDoc.exists() ? lastPrintDoc.data().lastPrintID : 0;
        const newPrintID = lastPrintID + 1;

        await addDoc(printsCollection, {
            print_id: newPrintID,
            print_name: print_name,
            print_url: print_url,
            print_tags: print_tags,
            createdAt: serverTimestamp()
        });

        await setDoc(doc(db, "metadata", "prints"), {
            lastPrintID: newPrintID,
        });
    }
    return { addPrint };
}