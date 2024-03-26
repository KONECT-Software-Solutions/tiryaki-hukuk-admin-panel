// Import the functions you need from the SDKs you need
import { getAllBlogs, addNewBlogPost, blogsTable} from "./services/blog-services.js";
import { signInUser } from "./services/auth-services.js";
import { BlogsTable } from "./components/BlogsTable";

// blogTable'ı class şeklinde yazdım ve export ettim. 
// item eklenildiğinde ve silindiğinde düzgünce render edebilmek için
// ama tam bitmedi biraz daha düzenleme yapmam gerekiyor.


getAllBlogs()
  .then((blogData) => {
    console.log(blogData);
    blogsTable.updateData(blogData);
    const tableContainer = document.getElementById('table-container');
    tableContainer.appendChild(blogsTable.table);
    tableContainer.appendChild(blogsTable.paginationContainer);
  })
  .catch((error) => {
    console.error('An error occurred:', error);
  });

const addNewBlogButton = document.getElementById('addNewBlog');
if (addNewBlogButton) {
  addNewBlogButton.addEventListener('click', addNewBlogPost);
}


const signinButton = document.getElementById('signin');
if (signinButton) {
  signinButton.addEventListener('click', signInUser);
}

