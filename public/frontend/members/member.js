import { getMember, deleteMember } from "../api/memberApi.js";

const addMember = document.querySelector("#addMemberBtn");
if (addMember) {
    addMember.addEventListener("click", () => {
        window.location.href = "member-form.html";
    });
}

// get member
const memberTable = document.querySelector("#memberTable");
if (memberTable) {
    function renderTable(members) {
        ////if table data null
        if (members.length === 0) {
            memberTable.innerHTML = `<tr><td colspan="6">No Data Found</td></tr>`;
             return;
        }
        document.getElementById('totalMembers').textContent = members.length;

        let tableData = ``;

        members.forEach((member, index) => {

            tableData += `
    <tr>
        <td>${index + 1}</td>
        <td>${member.name}</td>
        <td>${member.phone}</td>
        <td>${member.address ?? "-"}</td>
        <td>${member.gym?.gym_name ?? "-"}</td>
        <td>${member.plan?.name ?? "-"}</td>
        <td>${member.joining_date}</td>
        <td>${member.expire_date}</td>
        <td>''</td>
        <td>
          <button class="btn btn-outline-info btn-sm edit-member-btn" data-id="${member.id}">Edit</button>
          <button class="btn btn-outline-danger btn-sm delete-member-btn" data-id="${member.id}">Delete</button>
        </td>
    </tr>
    `;
        });

        memberTable.innerHTML = tableData;
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
    //On clicking the pagination button=====================
    pagination.addEventListener("click", async (e) => {
        if (e.target.classList.contains("page-btn")) {
            const page = e.target.dataset.page;

            const membersData = await getMember("", page);

            renderTable(membersData.data.data);

            renderPagination(
                membersData.data.current_page,
                membersData.data.last_page,
            );
        }
    });

    //member data get ===========================================
    try {
        const membersData = await getMember();

        //---importent=> because Pagination provides extra info. That is why add (plansData.data.data).
        renderTable(membersData.data.data);
        //for pagination function---------
        renderPagination(
            membersData.data.current_page,
            membersData.data.last_page,
        );
    } catch (error) {
        if (error.status === 403) {
            alert(error.message);
        }
        console.log("Error:", error);
    }

    //member search ==================================================
    const memberSearchInput = document.querySelector("#memberSearchInput");
    let timeout;
    memberSearchInput.addEventListener("input", () => {
        clearTimeout(timeout);

        timeout = setTimeout(async () => {
            try {
                const searchValue = memberSearchInput.value;

                const membersData = await getMember(searchValue);

                renderTable(membersData.data.data);
            } catch (error) {
                console.log("Search Error:", error);
            }
        }, 500); // 500ms delay
    });

    
    memberTable.addEventListener("click", (e) => {
        // yaha hum check kar rahe he.ki member table me kisi
        // btn per click hua hai waha per(edit-member-btn) ki class lagi hui hai ya nahi.
        //agar lagi hui hai to (data-id) se id nikal kar (const id) me dal do.
        if (e.target.classList.contains("edit-member-btn")) {
            const id = e.target.dataset.id;
            window.location.href = `member-form.html?id=${id}`;
        }
    });

    // MEMBER Delete  ============================================================
    memberTable.addEventListener("click", async (e) => {
        if (e.target.classList.contains("delete-member-btn")) {
            const confirmDelete = confirm("Are you sure?");
            if (!confirmDelete) return;

            try {
                const id = e.target.dataset.id;
                const response = await deleteMember(id);
                alert(response.message);
                // UI row remove
                e.target.closest("tr").remove();
            } catch (error) {
                console.log("Error:", error);
            }
        }
    });
}
