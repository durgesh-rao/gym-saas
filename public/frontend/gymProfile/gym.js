import { getGym, deleteGym } from "../api/gymApi.js";

const addGym = document.querySelector("#addGymBtn");
if (addGym) {
    addGym.addEventListener("click", () => {
        window.location.href = "gym-form.html";
    });
}

// get gyms
const gymTable = document.querySelector("#gymTable");
if (gymTable) {
    function renderTable(gyms) {
        ////if table data null
        if (gyms.length === 0) {
            gymTable.innerHTML = `<tr><td colspan="6">No Data Found</td></tr>`;
            return;
        }

        let tableData = ``;

        gyms.forEach((gym, index) => {
            tableData += `
    <tr>
        <td>${index + 1}</td>
        <td>${gym.user_id}</td>
        <td>${gym.gym_name}</td>
        <td>${gym.gym_address ?? "-"}</td>
        <td>-</td>
        <td>
          <button class="btn btn-outline-info btn-sm edit-gym-btn" data-id="${gym.id}">Edit</button>
          <button class="btn btn-outline-danger btn-sm delete-gym-btn" data-id="${gym.id}">Delete</button>
        </td>
    </tr>
    `;
        });

        gymTable.innerHTML = tableData;
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

            const gymsData = await getGym("", page);

            renderTable(gymsData.data.data);

            renderPagination(
                gymsData.data.current_page,
                gymsData.data.last_page,
            );
        }
    });

    //get gyms data===========================================
    try {
        const gymsData = await getGym();
        //---importent=> kyunki paginate extra info deta hai. isliye extra data jese(data.data) lagana padta hai.
        renderTable(gymsData.data.data);
        // pagination ke function ke liye---------
        renderPagination(gymsData.data.current_page, gymsData.data.last_page);
    } catch (error) {
        if (error.status === 403) {
            alert(error.message);
        }
        console.log("Error:", error);
    }

    //gym search workj==================================================
    const gymSearchInput = document.querySelector("#gymSearchInput");
    let timeout;
    gymSearchInput.addEventListener("input", () => {
        clearTimeout(timeout);

        timeout = setTimeout(async () => {
            try {
                const searchValue = gymSearchInput.value;

                const gymsData = await getGym(searchValue);

                renderTable(gymsData.data.data);
            } catch (error) {
                console.log("Search Error:", error);
            }
        }, 500); // 500ms delay
    });

 
    gymTable.addEventListener("click", (e) => {
       
        if (e.target.classList.contains("edit-gym-btn")) {
            const id = e.target.dataset.id;
            window.location.href = `gym-form.html?id=${id}`;
        }
    });

    ////** */ Gym Delete ============================================================
    gymTable.addEventListener("click", async (e) => {
        if (e.target.classList.contains("delete-gym-btn")) {
            const confirmDelete = confirm("Are you sure?");
            if (!confirmDelete) return;

            try {
                const id = e.target.dataset.id;
                const response = await deleteGym(id);
                alert(response.message);
                // UI se row remove
                e.target.closest("tr").remove();
            } catch (error) {
                console.log("Error:", error);
            }
        }
    });
}
