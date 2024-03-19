// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs} from "firebase/firestore";
import { firebaseConfig } from "/src/config/FirebaseConfig.js";


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const blogRef = collection(db, "blogs");

export async function getBlogDataWithComments() {
    const blogData = [];
    try {
        const querySnapshot = await getDocs(blogRef);
        for (const doc of querySnapshot.docs) {
            let docData = doc.data();
            docData.id = doc.id; // Add the document ID as a property
            // Reference to the 'comments' subcollection of the current blog document
            const commentsRef = collection(db, "blogs", doc.id, "comments");
            const commentData = [];
            // Get all comments from the 'comments' subcollection
            const commentsSnapshot = await getDocs(commentsRef);
            commentsSnapshot.docs.forEach(commentDoc => {
                commentData.push(commentDoc.data());
            });
            docData.comments = commentData; // Add comments to the blog data
            blogData.push(docData);
        }
        console.log("Blog data with comments:", blogData);
        return blogData;
    } catch (error) {
        console.error("Error getting blogs with comments:", error);
        return [];
    }
}
