import { addDoc, collection, serverTimestamp, doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "../config/firebase-config"

export const useAddTag = () => {
    const printsCollection = collection(db, "tags");

    const addTag = async ( {tag_name} ) => {
        const lastTagDoc = await getDoc(doc(db, "metadata", "tags"));
        const lastTagID = lastTagDoc.exists() ? lastTagDoc.data().lastTagID : 0;
        const newTagID = lastTagID + 1;

        await addDoc(printsCollection, {
            tag_id: newTagID,
            tag_name: tag_name,
            createdAt: serverTimestamp()
        });

        await setDoc(doc(db, "metadata", "tags"), {
            lastTagID: newTagID,
        });
    }
    return { addTag };
}