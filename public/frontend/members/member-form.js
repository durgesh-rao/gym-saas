import {
    createMember,
    fetchMemberData,
    updateMember,
    getGyms,
    fetchPlans,
} from "../api/memberApi.js";

const form = document.querySelector("#memberForm");
////Extracting the ID from the URL to update the member.
const memberId = new URLSearchParams(window.location.search).get("id");
const submitBtn = document.getElementById("saveBtn");
submitBtn.textContent = "Save";

//// function for handle form validation error /////////
function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    input.classList.add("is-invalid");
    error.textContent = message;
}
//// function for clear form validation error/////////
function clearErrors() {
    const inputs = document.querySelectorAll(".form-control, .form-select");

    inputs.forEach((input) => {
        input.classList.remove("is-invalid");
    });

    const errors = document.querySelectorAll(".invalid-feedback");

    errors.forEach((error) => {
        error.textContent = "";
    });
}

////form validation work/////////////////////////////////////////////
function validateMemberForm(formData) {
    clearErrors();
    let isValid = true;

    if (!formData.gymId) {
        showError("gyms", "gymError", "Please select a gym");
        isValid = false;
    }

    if (!formData.planId) {
        showError("plan_id", "planError", "Please select a plan");
        isValid = false;
    }

    if (!formData.name) {
        showError("name", "nameError", "Please enter name");
        isValid = false;
    } else if (formData.name.length < 3) {
        showError("name", "nameError", "Name must be at least 3 characters");
        isValid = false;
    } else if (formData.name.length > 30) {
        showError("name", "nameError", "Name cannot exceed 30 characters");
        isValid = false;
    }

    const phonePattern = /^[6-9]\d{9}$/;
    if (!formData.phone) {
        showError("phone", "phoneError", "Please Enter phone number");
        isValid = false;
    } else if (!phonePattern.test(formData.phone)) {
        showError("phone", "phoneError", "Enter a valid 10 digit phone number");
        isValid = false;
    }

    if (!formData.joiningDate) {
        showError(
            "joiningDate",
            "joiningDateError",
            "Please Enter joining date",
        );
        isValid = false;
    }

    if (!formData.address) {
        showError("address", "addressError", "Please Enter address");
        isValid = false;
    } else if (formData.address.length > 255) {
        showError(
            "address",
            "addressError",
            "address cannot exceed 255 characters",
        );
        isValid = false;
    }

    return isValid;
}

if (form) {
    //// get gyms for form(gym dropdown load)///////
    try {
        const gymData = await getGyms();
        const selectGymField = document.getElementById("gyms");

        gymData.data.forEach((gym) => {
            const option = document.createElement("option");

            option.value = gym.id;
            option.textContent = gym.gym_name;

            selectGymField.appendChild(option);
        });
    } catch (error) {
        console.error(error);
        alert("Failed to load gyms");
    }

    ///fetch plans by gym id
    const gymSelect = document.getElementById("gyms");
    const planSelect = document.getElementById("plan_id");

    async function loadPlans(gymId) {
        const plansData = await fetchPlans(gymId);

        planSelect.innerHTML = `<option value="" selected disabled>Select Plan</option>`;

        plansData.data.forEach((plan) => {
            const option = document.createElement("option");
            option.value = plan.id;
            option.textContent = plan.name;

            planSelect.appendChild(option);
        });
    }

    gymSelect.addEventListener("change", async function () {
        try {
            const gymId = this.value;
            if (!gymId) return;

            await loadPlans(gymId);
        } catch (error) {
            console.error(error);
            alert("Failed to load plans");
        }
    });

    ///////// fetch members for update work//////////

    if (memberId) {
        submitBtn.textContent = "Update";

        try {
            const response = await fetchMemberData(memberId);
            
            document.getElementById("name").value = response.data.name;
            document.getElementById("phone").value = response.data.phone;
            document.getElementById("address").value = response.data.address;
            document.getElementById("joiningDate").value =
                response.data.joining_date;

            document.getElementById("gyms").value = response.data.gym_id;
            await loadPlans(response.data.gym_id);
            planSelect.value = response.data.plan_id;
        } catch (error) {
            alert("Something went wrong!");
            console.log("Error:", error);
        }
    }

    ////// Form submit work////////////*************/
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const gymId = document.getElementById("gyms").value;
        const planId = document.getElementById("plan_id").value;
        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const joiningDate = document.getElementById("joiningDate").value;
        const address = document.getElementById("address").value.trim();

        const formData = {
            gymId: gymId,
            planId: planId,
            name: name,
            phone: phone,
            joiningDate: joiningDate,
            address: address,
        };

        const isValid = validateMemberForm(formData);
        if (!isValid) {
            return;
        }

        try {
            if (memberId) {
                const response = await updateMember(memberId, formData);
                if (response.status === 1) {
                    alert(response.message);
                    window.location.href = "member.html";
                }
            } else {
                const response = await createMember(formData);

                if (response.status === 1) {
                    alert(response.message);
                    window.location.href = "member.html";
                }
            }
        } catch (error) {
            if (error.errors) {
                console.log(error.errors);
                return;
            }

            alert(error.message || "Something went wrong!");
        }
    });
}
