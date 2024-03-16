// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvdTUs36DFXUIZ3S7EGZJlSeeDxXg1mGY",
  authDomain: "tiryaki-hukuk-admin-pane-9a3f2.firebaseapp.com",
  projectId: "tiryaki-hukuk-admin-pane-9a3f2",
  storageBucket: "tiryaki-hukuk-admin-pane-9a3f2.appspot.com",
  messagingSenderId: "432646173233",
  appId: "1:432646173233:web:1c8a7ad94bacb703781b10",
  measurementId: "G-0LMBJQ2524"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Get collection from firestore
const getCollection = async (db, collectionName) => {
  const querySnapshot = await getDocs(collection(db, collectionName)).then((res) => {
    console.log('Collection:', res);
  })
  querySnapshot?.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
  });
};
getCollection(db, 'blogs')


// Function to get all blogs
async function getAllBlogs() {
  const blogsCollectionRef = collection(db, "blogs");
  const snapshot = await getDocs(blogsCollectionRef);
  const blogsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return blogsList;
}

// Usage
getAllBlogs().then(blogs => {
  console.log(blogs);
});


// signin button
const signin = document.getElementById('signin');

// if signin button clicked
if (signin) {
  signin.addEventListener('click', () => {
    const userEmail = document.getElementById('email').value;
    const userPassword = document.getElementById('password').value;
    const rememberUser = document.getElementById('remember').checked;
  
    console.log('User email:', userEmail);
    console.log('User password:', userPassword);
    console.log('Remember user:', rememberUser);
  
    signInWithEmailAndPassword(auth, userEmail, userPassword)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log('User signed in:', user);
        if (rememberUser) {
          // Remember user logic here
        }
        // Redirect to index.html page
        window.location.href = 'index.html';
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Sign in error:', errorCode, errorMessage);
      });
  });
}


