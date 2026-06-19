import { getPlan, deletePlan } from "../api/planApi.js";

const addPlan = document.querySelector("#addPlanBtn");
if (addPlan) {
    addPlan.addEventListener("click", () => {
        window.location.href = "plan-form.html";
    });
}

// get plans
const planTable = document.querySelector("#planTable");
if (planTable) {
    function renderTable(plans) {
       
        if (plans.length === 0) {
            planTable.innerHTML = `<tr><td colspan="6">No Data Found</td></tr>`;
             return;
        }

        let tableData = ``;

        plans.forEach((plan, index) => {
            const planStatus = plan.is_active === 1 ? "Active" : "Inactive";
    
            tableData += `
    <tr>
        <td>${index + 1}</td>
        <td>${plan.gym?.gym_name ?? "-"}</td>
        <td>${plan.name}</td>
        <td>${plan.duration}</td>
        <td>${plan.price}</td>
        <td>${planStatus}</td>
        <td>
          <button class="btn btn-outline-info btn-sm edit-plan-btn" data-id="${plan.id}">Edit</button>
          <button class="btn btn-outline-danger btn-sm delete-plan-btn" data-id="${plan.id}">Delete</button>
        </td>
    </tr>
    `;
        });

        planTable.innerHTML = tableData;
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
    ///On clicking pagination button=====================
    pagination.addEventListener("click", async (e) => {
        if (e.target.classList.contains("page-btn")) {
            const page = e.target.dataset.page;

            const plansData = await getPlan("", page);

            renderTable(plansData.data.data);

            renderPagination(
                plansData.data.current_page,
                plansData.data.last_page,
            );
        }
    });

    //Plan ka sara data get===========================================
    try {
        const plansData = await getPlan();

        //---importent=> because Pagination provides extra info. That is why add (plansData.data.data).
        renderTable(plansData.data.data);
        // for pagination function---------
        renderPagination(plansData.data.current_page, plansData.data.last_page);
    } catch (error) {
        if (error.status === 403) {
            alert(error.message);
        }
        console.log("Error:", error);
    }

    //plan search work==================================================
    const planSearchInput = document.querySelector("#planSearchInput");
    let timeout;
    planSearchInput.addEventListener("input", () => {
        clearTimeout(timeout);

        timeout = setTimeout(async () => {
            try {
                const searchValue = planSearchInput.value;

                const plansData = await getPlan(searchValue);

                renderTable(plansData.data.data);
            } catch (error) {
                console.log("Search Error:", error);
            }
        }, 500); // 500ms delay
    });

  
    planTable.addEventListener("click", (e) => {
        if (e.target.classList.contains("edit-plan-btn")) {
            const id = e.target.dataset.id;
            window.location.href = `plan-form.html?id=${id}`;
        }
    });

   ////for delete plan
    planTable.addEventListener("click", async (e) => {
        if (e.target.classList.contains("delete-plan-btn")) {
            const confirmDelete = confirm("Are you sure?");
            if (!confirmDelete) return;

            try {
                const id = e.target.dataset.id;
                const response = await deletePlan(id);
                alert(response.message);
                // UI se row remove
                e.target.closest("tr").remove();
            } catch (error) {
                console.log("Error:", error);
            }
        }
    });
}
