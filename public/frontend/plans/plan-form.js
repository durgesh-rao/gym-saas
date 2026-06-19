import {
    createPlan,
    getGyms,
    fetchPlansData,
    updatePlan,
} from "../api/planApi.js";

///get id from url for update work
const planId = new URLSearchParams(window.location.search).get("id");
const submitBtn = document.getElementById("saveBtn");
submitBtn.textContent = "Save";

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

    if (!formData.gymId) {
        showError("gyms", "gymError", "Please select a gym");
        isValid = false;
    }

    if (!formData.planType) {
        showError("planType", "planTypeError", "Please enter plan name");
        isValid = false;
    } else if (formData.planType.length < 3) {
        showError(
            "planType",
            "planTypeError",
            "plan name must be at least 3 characters",
        );
        isValid = false;
    } else if (formData.planType.length > 50) {
        showError(
            "planType",
            "planTypeError",
            "plan name cannot exceed 50 characters",
        );
        isValid = false;
    }

    if (!formData.duration) {
        showError("duration", "durationError", "Please enter duration(days)");
        isValid = false;
    } else if (Number(formData.duration) < 1) {
        showError(
            "duration",
            "durationError",
            "Duration must be at least 1 day",
        );
        isValid = false;
    }

    if (!formData.price) {
        showError("price", "priceError", "Please enter price");
        isValid = false;
    } else if (Number(formData.price) < 0) {
        showError("price", "priceError", "Price cannot be negative");
        isValid = false;
    }

    if (formData.description.length > 255) {
        showError(
            "description",
            "descriptionError",
            "description cannot exceed 255 characters",
        );
        isValid = false;
    }
    return isValid;
}

const form = document.querySelector("#planForm");

if (form) {
    //// form ke liye gym get(gym dropdown load)///////
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

    ///////// plan fetch for update   //////////

    if (planId) {
        submitBtn.textContent = "Update";
        try {
            const response = await fetchPlansData(planId);

            document.getElementById("planType").value = response.data.name;
            document.getElementById("duration").value = response.data.duration;
            document.getElementById("price").value = response.data.price;
            document.getElementById("description").value =
                response.data.description;
            document.getElementById("gyms").value = response.data.gym_id;
        } catch (error) {
            alert("Something went wrong!");
            console.log("Error:", error);
        }
    }

    ////// Form submit////////////*************/
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const gymId = document.getElementById("gyms").value;
        const planType = document.getElementById("planType").value.trim();
        const duration = document.getElementById("duration").value.trim();
        const price = document.getElementById("price").value.trim();
        const description = document.getElementById("description").value.trim();

        const formData = {
            gymId: gymId,
            planType: planType,
            duration: duration,
            price: price,
            description: description,
        };
        const isValid = validatePlanForm(formData);
        if (!isValid) {
            return;
        }

        try {
            if (planId) {
                const response = await updatePlan(planId, formData);
                if (response.status === 1) {
                    alert(response.message);
                    window.location.href = "plan.html";
                }
            } else {
                const response = await createPlan(formData);

                if (response.status === 1) {
                    alert(response.message);
                    window.location.href = "plan.html";
                }
            }
        } catch (error) {
            alert("Something went wrong!");
            console.log("Error:", error);
        }
    });
}
