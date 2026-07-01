import { createUser, fetchUserData, updateUser } from "../api/userApi.js";

const userId = new URLSearchParams(window.location.search).get("id");
const submitBtn = document.getElementById("saveBtn");
submitBtn.textContent = "Save";

const form = document.querySelector("#userForm");

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

    if (!formData.role) {
        showError("role", "roleError", "Please select a role");
        isValid = false;
    }

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

    if (!formData.email) {
        showError("email", "emailError", "Please enter email address");
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        showError("email", "emailError", "Please enter a valid email address");
        isValid = false;
    }

    ///// Create password check
    if (!userId) {

        if (!formData.password) {
            showError("password", "passwordError", "Please enter password");
            isValid = false;
        } else if (formData.password.length < 8) {
            showError("password", "passwordError", "Password must be at least 8 characters");
            isValid = false;
        }

        if (!formData.password_confirmation) {
            showError("password_confirmation", "passwordConfirmationError", "Please confirm your password");
            isValid = false;
        } else if (formData.password !== formData.password_confirmation) {
            showError("password_confirmation", "passwordConfirmationError", "Passwords do not match");
            isValid = false;
        }

    }

    //// Update password check
    else if (formData.password) {

        if (formData.password.length < 8) {
            showError("password", "passwordError", "Password must be at least 8 characters");
            isValid = false;
        }

        if (formData.password !== formData.password_confirmation) {
            showError("password_confirmation", "passwordConfirmationError", "Passwords do not match");
            isValid = false;
        }
    }

    return isValid;
}

if (form) {
    //user fetch for update
    if (userId) {
        submitBtn.textContent = "Update";

        try {
            const response = await fetchUserData(userId);

            document.getElementById("role").value = response.data.role;
            document.getElementById("name").value = response.data.name;
            document.getElementById("email").value = response.data.email;
        } catch (error) {
            alert("Something went wrong!");
            console.log("Error:", error);
        }
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const password_confirmation = document.getElementById(
            "password_confirmation",
        ).value;
        const role = document.getElementById("role").value;

        const formData = {
            name: name,
            email: email,
            password: password,
            password_confirmation: password_confirmation,
            role: role,
        };
        const isValid = validatePlanForm(formData);
        if (!isValid) {
            return;
        }

        try {
            if (userId) {
                const response = await updateUser(userId, formData);
                if (response.status === 1) {
                    window.location.href = "user.html";
                    alert(response.message);
                }
            } else {
                const response = await createUser(formData);

                if (response.status === 1) {
                    window.location.href = "user.html";
                    alert(response.message);
                }
            }
        } catch (error) {
            alert("Something went wrong!");
            console.log("Error:", error);
        }
    });
}
