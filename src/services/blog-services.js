// Import the functions you need from the SDKs you need
import { collection, getDocs, addDoc, deleteDoc, doc} from "firebase/firestore";
import { db } from "/src/config/firebase-init.js";


const blogRef = collection(db, "blogs");
let blogData = [];

export async function getBlogDataWithComments() {
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

export async function AddNewBlogPost(event){
    event.preventDefault(); // Ensure form submission is handled correctly
  
    // Attempt to retrieve and validate DOM elements before proceeding
    const titleElement = document.getElementById('title');
    const categoryElement = document.getElementById('category');
    const contentElement = document.getElementById('content');
  
   // Check if elements exist and if their values are empty
    if (!titleElement.value.trim() || !categoryElement.value.trim() || !contentElement.value.trim()) {
      console.error('One or more input fields are empty.');
    return;
    }
    // Building the blog post object with values from input fields
    const blogDataAdd = {
      author: "admin",
      created_date: new Date(),
      updated_date: new Date(),
      url: "https://konect-software-solutions.github.io/tiryaki-hukuk-web-project/blog-single.html",
      title: titleElement.value,
      image: "img link here", // Replace with dynamic data if necessary
      category: categoryElement.value,
      content: contentElement.value,
    };
  
    // Calling the function to add the new blog post
    try {
      await addDoc(blogRef, blogDataAdd); // Ensure addDoc is awaited
      console.log("Blog post added successfully!");
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };
  // Sign-in button start


async function deleteBlogPost(blogId) {
  // Reference to the document to be deleted
  const blogDocRef = doc(db, "blogs", blogId);

  try {
    // Delete the document
    await deleteDoc(blogDocRef);
    console.log(`Blog post with ID: ${blogId} has been deleted.`);

    // Remove the corresponding table row
    const row = document.getElementById(`blog-row-${blogId}`);
    if (row) {
      row.remove();
    }
    blogData = blogData.filter(blog => blog.id !== blogId);

    // Hide the modal after deletion
    hideDeleteModal();
  } catch (error) {
    console.error("Error deleting blog post:", error);
  }
}
/* function added to the global scope because 
the show delete modal function in script.js uses it */
window.deleteBlogPost = deleteBlogPost; 

