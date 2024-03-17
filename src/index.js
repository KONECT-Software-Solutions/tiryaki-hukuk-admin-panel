// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";

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


// Collection Reference
const blogRef = collection(db, "blogs");

// Function to format the timestamp
function formatDate(timestamp) {
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString("en-US");
}

// Function to create a table from the blog data with pagination
function createTable(data, itemsPerPage = 10) {
  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        <th class="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">Blog Başlığı</th>
        <th class="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Yazar</th>
        <th class="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Yaratılma Tarihi</th>
        <th class="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Aksiyonlar</th>
      </tr>
    </thead>
  `;

  // Calculate the number of pages needed
  const totalPages = Math.ceil(data.length / itemsPerPage);
  let currentPage = 1;

  // Function to render the current page
  function renderPage(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = data.slice(start, end);

    // Clear the current table body
    const tbody = table.querySelector('tbody');
    if (tbody) {
      tbody.remove();
    }

    // Create a new tbody element and populate it with the current page's data
    const newTbody = document.createElement('tbody');
    pageData.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="py-2 px-4 border-b border-b-gray-50">
          <div class="flex items-center">
              <img src="https://placehold.co/32x32" alt="" class="w-8 h-8 rounded object-cover block">
              <a href="#" class="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">${item.title || ''}</a>
          </div>
        </td>
        <td class="py-2 px-4 border-b border-b-gray-50">
          <span class="text-[13px] font-medium text-gray-400">${item.author || ''}</span>
        </td>
        <td class="py-2 px-4 border-b border-b-gray-50">
          <span class="text-[13px] font-medium text-gray-400">$${formatDate(item.created_date)}</span>
        </td>
        <td class="py-2 px-4 border-b border-b-gray-50">
          <div class="flex space-x-5">
              <button class="text-blue-500 hover:text-blue-600 ">Değiştir</button>
              <button class="text-red-500 hover:text-red-600">Sil</button>
              <button class="text-green-500 hover:text-green-600">Görüntüle</button>
          </div>
        </td>
      `;
      newTbody.appendChild(row);
    });
    table.appendChild(newTbody);
  }

  // Render the first page initially
  renderPage(currentPage);

  // Create pagination buttons
  const paginationContainer = document.createElement('div');
  paginationContainer.className = 'flex justify-end mt-4 w-full pagination-container'; // Ensure full width

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.className = 'pagination-button h-8 px-4 m-2 text-sm text-indigo-100 transition-colors duration-150 bg-indigo-500 rounded-lg focus:shadow-outline hover:bg-indigo-800'; // Add padding and styles
    button.onclick = () => {
      currentPage = i;
      renderPage(currentPage);
    };
    paginationContainer.appendChild(button);
  }

  return { table, paginationContainer };


}

// Get Blog Collection Documents Data
getDocs(blogRef).then(querySnapshot => {
  let i = 0;
  let blogData = [];
  querySnapshot.docs.forEach(doc => {
    blogData.push(doc.data());
    // console.log(`Blog Data ${i}:`, doc.data());
    i++; 
    
    // Reference to the 'comments' subcollection of the current blog document
    const commentsRef = collection(db, "blogs", doc.id, "comments");

    let commentData = [];
    // Get all comments from the 'comments' subcollection
    getDocs(commentsRef).then(commentsSnapshot => {
      commentsSnapshot.docs.forEach(commentDoc => {
        commentData.push(commentDoc.data());
        //console.log('Comment Data:', commentDoc.data());
      });
    }).catch(error => {
      console.error("Error getting comments:", error);
    });
  });
  console.log('Blog Data:', blogData.length, blogData);
  // Append the table to your table container div
  const { table, paginationContainer } = createTable(blogData);
  const tableContainer = document.getElementById('table-container');
  tableContainer.appendChild(table);
  tableContainer.appendChild(paginationContainer);}).catch(error => {
  console.error("Error getting blogs:", error);
});



// Collection Reference
// Add new blog document with a subcollection function
const blogData = {
  title: "11111",
  image: "image link here",
  content: "This is a new blog post content.",
  author: "ebrar karademir",
  created_date: new Date(),
  updated_date: new Date(),
};


const addNewBlog = async (blogData) => {
  try {
    addDoc(blogRef, blogData);
    
    console.log("Blog post added.");

  } catch (error) {
    console.error("Error adding document:", error);
  }
};

// Add new blog post button start

const addNewBlogElement = document.getElementById('addNewBlog');

if (addNewBlogElement) {
  addNewBlogElement.addEventListener('click', () => {
    addNewBlog(blogData);
  }); 
};

// Add new blog post button end

// signin button start
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

// signin button end


