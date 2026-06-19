const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorDiv = document.getElementById("errorMsg");
const togglePassword = document.getElementById("togglePassword");
const loginBtn = document.getElementById("loginBtn");

togglePassword.addEventListener("click", function () {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.innerHTML = '<i class="bi bi-eye-slash"></i>';
    } else {
        passwordInput.type = "password";
        togglePassword.innerHTML = '<i class="bi bi-eye"></i>';
    }
});

// form submit work
form.addEventListener("submit", function (e) {
    e.preventDefault();

    loginBtn.disabled = true; // button disable

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        errorDiv.textContent = "Email & Password required";
        loginBtn.disabled = false;
        return;
    }
    errorDiv.textContent = ""; // clear old error

    fetch("http://localhost/gym-saas/public/api/login", {
        method: "POST",
        body: JSON.stringify({
            email: email,
            password: password,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((Response) => Response.json())
        .then((data) => {
            if (data.token) {
                localStorage.setItem("token", data.token);
                window.location.href = "dashboard.html";
            } else {
                alert(data.message);
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            loginBtn.disabled = false;
        });
});
