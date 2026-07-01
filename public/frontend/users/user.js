import { getUsers, deleteUser } from "../api/userApi.js";

const addUser = document.querySelector("#addUserBtn");
if (addUser) {
    addUser.addEventListener("click", () => {
        window.location.href = "user-form.html";
    });
}

// get users
const userTable = document.querySelector("#userTable");
if (userTable) {
    function renderTable(users) {
        
        ////if table data null
        if (users.length === 0) {
            userTable.innerHTML = `<tr><td colspan="6">No Data Found</td></tr>`;
            return;
        }
        document.getElementById('totalUsers').textContent = users.length;

        let tableData = ``;

        users.forEach((user, index) => {
            tableData += `
    <tr>
        <td>${index + 1}</td>
        <td>${user.name}</td>
        <td>${user.role}</td>
        <td>${user.email}</td>
        <td>${new Date(user.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short',year: 'numeric'})}</td>
        <td>
          <button class="btn btn-outline-info btn-sm edit-user-btn" data-id="${user.id}">Edit</button>
          <button class="btn btn-outline-danger btn-sm delete-user-btn" data-id="${user.id}">Delete</button>
        </td>
    </tr>
    `;
        });

        userTable.innerHTML = tableData;
    }

  
    const pagination = document.querySelector("#pagination");

    function renderPagination(currentPage, lastPage) {
        let buttons = "";

        for (let i = 1; i <= lastPage; i++) {
            buttons += `
            <button 
                class="btn btn-sm btn-primary me-1 page-btn"
                data-page="${i}">
                ${i}
            </button>
        `;
        }
        pagination.innerHTML = buttons;
    }
    ///clicking the pagination button=====================
    pagination.addEventListener("click", async (e) => {
        if (e.target.classList.contains("page-btn")) {
            const page = e.target.dataset.page;

            const usersData = await getUsers("", page);

            renderTable(usersData.data.data);

            renderPagination(
                usersData.data.current_page,
                usersData.data.last_page,
            );
        }
    });

    //get users data===========================================
    try {
        const usersData = await getUsers();
        //---importent=> kyunki paginate extra info deta hai. isliye extra data jese(data.data) lagana padta hai.
        renderTable(usersData.data.data);
        // pagination ke function ke liye---------
        renderPagination(usersData.data.current_page, usersData.data.last_page);
    } catch (error) {
        if (error.status === 403) {
            alert(error.message);
        }
        console.log("Error:", error);
    }

    //user search workj==================================================
    const userSearchInput = document.querySelector("#userSearchInput");
    let timeout;
    userSearchInput.addEventListener("input", () => {
        clearTimeout(timeout);

        timeout = setTimeout(async () => {
            try {
                const searchValue = userSearchInput.value;

                const usersData = await getUsers(searchValue);

                renderTable(usersData.data.data);
            } catch (error) {
                console.log("Search Error:", error);
            }
        }, 500); // 500ms delay
    });

 
    userTable.addEventListener("click", (e) => {
       
        if (e.target.classList.contains("edit-user-btn")) {
            const id = e.target.dataset.id;
            window.location.href = `user-form.html?id=${id}`;
        }
    });

    ////** */ User Delete ============================================================
    userTable.addEventListener("click", async (e) => {
        if (e.target.classList.contains("delete-user-btn")) {
            const confirmDelete = confirm("Are you sure?");
            if (!confirmDelete) return;

            try {
                const id = e.target.dataset.id;
                const response = await deleteUser(id);
                alert(response.message);
                // UI se row remove
                e.target.closest("tr").remove();
            } catch (error) {
                console.log("Error:", error);
            }
        }
    });
}
