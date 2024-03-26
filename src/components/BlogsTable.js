import { formatDate } from "/src/utils/utils.js";


class BlogsTable {
    constructor(blogData, itemsPerPage = 10) {
      this.blogData = blogData;
      this.itemsPerPage = itemsPerPage;
      this.currentPage = 1;
      this.table = document.createElement('table');
      this.table.className = 'w-full bg-gray-100';
      this.paginationContainer = document.createElement('div');
      this.paginationContainer.className = 'flex justify-end mt-4 w-full pagination-container';
    }
  
    renderTable() {
      this.clearTable();
      this.renderHeader();
      this.renderPage(this.currentPage);
      this.renderPagination();
    }
  
    clearTable() {
      this.table.innerHTML = '';
      this.paginationContainer.innerHTML = '';
    }
  
    renderHeader() {
      this.table.innerHTML = `
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
    }
  
    renderPage(page) {
      const start = (page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      const pageData = this.blogData.slice(start, end);
  
      const tbody = document.createElement('tbody');
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
    <button class="text-sm bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded" onclick="window.location.href='${item.url}';">
    Görüntüle
    </button>
    <button class="text-sm bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded" onclick="showDeleteModal('${item.id}')">
    Sil
    </button>
  </div>
</td> 
        `;
        tbody.appendChild(row);
      });
      this.table.appendChild(tbody);
    }
  
    renderPagination() {
      const totalPages = Math.ceil(this.blogData.length / this.itemsPerPage);
      for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = 'pagination-button h-8 px-4 m-2 text-sm text-white transition-colors duration-150 bg-gray-800 rounded-lg focus:shadow-outline hover:bg-indigo-800';
        button.addEventListener('click', () => {
          this.currentPage = i;
          this.renderTable();
        });
        this.paginationContainer.appendChild(button);
      }
    }
  
    updateData(newData) {
      this.blogData = newData;
      this.currentPage = 1;
      this.renderTable();
    }

    addBlogPost(blogPost) {
      console.log('Blog post added:', blogPost);
      this.blogData.push(blogPost);
      this.renderTable();
    }

    deleteBlogPost(blogId) {
      console.log('Blog post deleted:', blogId);
      this.blogData = this.blogData.filter(blog => blog.id !== blogId);
      this.renderTable();
    }
  }
  
  export { BlogsTable };
  