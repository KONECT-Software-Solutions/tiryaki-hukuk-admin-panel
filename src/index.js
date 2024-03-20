// Import the functions you need from the SDKs you need
import { collection, getDocs, addDoc, deleteDoc, doc} from "firebase/firestore";
import { db } from "/src/config/firebase-init.js";
import { getBlogDataWithComments, AddNewBlogPost} from "/src/services/blog-services.js";
import { signInUser } from "/src/services/auth-services.js";
import { formatDate } from "/src/utils/utils.js";

getBlogDataWithComments(); // I added this function to test if I can sepetate the blog data services from the index.js file

// Function to create a table from the blog data with pagination
function createTable(itemsPerPage = 10) {
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
  const totalPages = Math.ceil(blogData.length / itemsPerPage);
  let currentPage = 1;

  // Function to render the current page
  function renderPage(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = blogData.slice(start, end);


    // Clear the current table body
    const tbody = table.querySelector('tbody');
    if (tbody) {
      tbody.remove();
    }

    // Create a new tbody element and populate it with the current page's data
    const newTbody = document.createElement('tbody');
    pageData.forEach(item => {
      const row = document.createElement('tr');
      row.id = `blog-row-${item.id}`; // Assign an ID to the row
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


let blogData = [];

// Collection Reference
const blogRef = collection(db, "blogs");
// Get Blog Collection Documents Data
getDocs(blogRef).then(querySnapshot => {
  let i = 0;
  blogData = [];
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
  const { table, paginationContainer } = createTable();
  const tableContainer = document.getElementById('table-container');
  tableContainer.appendChild(table);
  tableContainer.appendChild(paginationContainer);}).catch(error => {
  console.error("Error getting blogs:", error);
});

// Event listener for the 'Add new blog post' button
const addNewBlogElement = document.getElementById('addNewBlog');
if (addNewBlogElement) {
  addNewBlogElement.addEventListener('click', AddNewBlogPost);
}
// Function to handle the addition of a new blog post


const signinButton = document.getElementById('signin');
// Add click event listener to sign-in button
if (signinButton) {
  signinButton.addEventListener('click', signInUser);
}



