// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { firebaseConfig } from "/src/config/FirebaseConfig.js";

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
  table.className = 'w-full bg-gray-100'; 

  table.innerHTML = `
    <thead>
      <tr>
        <th class="w-1/4 text-[12px] uppercase tracking-wide font-medium text-gray-600 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">Başlık</th>
        <th class="w-1/4 text-[12px] uppercase tracking-wide font-medium text-gray-600 py-2 px-4 bg-gray-50 text-left">Yazar</th>
        <th class="w-1/4 text-[12px] uppercase tracking-wide font-medium text-gray-600 py-2 px-4 bg-gray-50 text-left">Yaratılma Tarihi</th>
        <th class="w-1/4 text-[12px] uppercase tracking-wide font-medium text-gray-600 py-2 px-4 bg-gray-50 text-left">Column</th>
        <th class="w-1/4 text-[12px] uppercase tracking-wide font-medium text-gray-600 py-2 px-4 bg-gray-50 text-left">Column</th>
        <th class="w-1/4 text-[12px] uppercase tracking-wide font-medium text-gray-600 py-2 px-4 bg-gray-50 text-left">Aksiyonlar</th>

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
    console.log('Data:', data);


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
              <a href="#" class="text-gray-600 text-sm font-medium hover:text-blue-500 truncate">${item.title || ''}</a>
          </div>
        </td>
        <td class="py-2 px-4 border-b border-b-gray-50">
          <span class="text-[13px] font-medium text-gray-600">${item.author || ''}</span>
        </td>
        <td class="py-2 px-4 border-b border-b-gray-50">
          <span class="text-[13px] font-medium text-gray-600">${formatDate(item.created_date)}</span>
        </td>
        
      <td class="py-2 px-4 border-b border-b-gray-50">
        <div class="flex space-x-5">
          <span class="text-[13px] font-medium text-gray-600">Data</span>
        </div>
      </td>
      <td class="py-2 px-4 border-b border-b-gray-50">
      <div class="flex space-x-5">
        <span class="text-[13px] font-medium text-gray-600">Data</span>
      </div>
    </td>
    <td class="py-2 px-4 border-b border-b-gray-50 flex justify-between">
    <div class="button-container relative">
      <button class="text-sm bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded">
        Değiştir
      </button>
      <button class="text-sm bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded">
        Görüntüle
      </button>
      <button class="text-sm bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded" onclick="showDeleteModal('${item.id}')">
      Sil
      </button>
    
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
    button.className = 'pagination-button h-8 px-4 m-2 text-sm text-white transition-colors duration-150 bg-gray-800 rounded-lg focus:shadow-outline hover:bg-indigo-800'; // Add padding and styles
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
    let docData = doc.data();
    docData.id = doc.id; // Add the document ID as a property
    blogData.push(docData);
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
  // Append the table to your table container div
  const { table, paginationContainer } = createTable(blogData);
  const tableContainer = document.getElementById('table-container');
  tableContainer.appendChild(table);
  tableContainer.appendChild(paginationContainer);}).catch(error => {
  console.error("Error getting blogs:", error);
});



// Collection Reference
// Add new blog document with a subcollection function
const blogDataAdd = {
  title: "11111",
  image: "image link here",
  content: "This is a new blog post content.",
  author: "ebrar karademir",
  created_date: new Date(),
  updated_date: new Date(),
};


const addNewBlog = async (blogDataAdd) => {
  try {
    addDoc(blogRef, blogDataAdd);
    
    console.log("Blog post added.");

  } catch (error) {
    console.error("Error adding document:", error);
  }
};

// Add new blog post button start

const addNewBlogElement = document.getElementById('addNewBlog');

if (addNewBlogElement) {
  addNewBlogElement.addEventListener('click', () => {
    addNewBlog(blogDataAdd);
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


