import { createGym, fetchGymData, updateGym } from "../api/gymApi.js";

const gymId = new URLSearchParams(window.location.search).get("id");
const submitBtn = document.getElementById("saveBtn");
submitBtn.textContent = "Save";

const form = document.querySelector("#gymForm");

////validation work
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
function validatePlanForm(formData) {
    clearErrors();
    let isValid = true;

    if (!formData.name) {
        showError("name", "nameError", "Please enter gym name");
        isValid = false;
    } else if (formData.name.length < 3) {
        showError(
            "name",
            "nameError",
            "Gym name must be at least 3 characters",
        );
        isValid = false;
    } else if (formData.name.length > 100) {
        showError("name", "nameError", "Gym name cannot exceed 100 characters");
        isValid = false;
    }

    if (!formData.address) {
        showError("address", "addressError", "Please enter address");
        isValid = false;
    } else if (formData.address.length < 3) {
        showError(
            "address",
            "addressError",
            "address must be at least 3 characters",
        );
        isValid = false;
    } else if (formData.address.length > 255) {
        showError(
            "address",
            "addressError",
            "plan name cannot exceed 255 characters",
        );
        isValid = false;
    }
    return isValid;
}

if (form) {
    //gym fetch for update 
    if (gymId) {
        submitBtn.textContent = "Update";

        try {
            const response = await fetchGymData(gymId);

            document.getElementById("name").value = response.data.gym_name;
            document.getElementById("address").value =
                response.data.gym_address;
        } catch (error) {
            alert("Something went wrong!");
            console.log("Error:", error);
        }
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const address = document.getElementById("address").value.trim();

        const formData = {
            name: name,
            address: address,
        };
        const isValid = validatePlanForm(formData);
        if (!isValid) {
            return;
        }

        try {
            if (gymId) {
                submitBtn.textContent = "Update";
                const response = await updateGym(gymId, formData);
                if (response.status === 1) {
                    window.location.href = "gym.html";
                    alert(response.message);
                }
            } else {
                const response = await createGym(formData);

                if (response.status === 1) {
                    window.location.href = "gym.html";
                    alert(response.message);
                }
            }
        } catch (error) {
            alert("Something went wrong!");
            console.log("Error:", error);
        }
    });
}
