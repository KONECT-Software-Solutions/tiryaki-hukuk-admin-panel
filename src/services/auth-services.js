import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "/src/config/firebase-init.js";


// Sign-in function
export async function signInUser() {
    const userEmail = document.getElementById('email').value;
    const userPassword = document.getElementById('password').value;
    const rememberUser = document.getElementById('remember').checked;
  
    console.log('User email:', userEmail);
    console.log('User password:', userPassword);
    console.log('Remember user:', rememberUser);
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, userEmail, userPassword);
      const user = userCredential.user;
      console.log('User signed in:', user);
  
      if (rememberUser) {
        // Remember user logic here
      }
  
      // Redirect to index.html page
      window.location.href = 'index.html';
    } catch (error) {
      console.error('Sign in error:', error.code, error.message);
    }
  }
  // Sign-in button end