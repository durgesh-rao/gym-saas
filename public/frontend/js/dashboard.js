const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}
//// checking whether the user is logged in or not. using token.
fetch("http://localhost/gym-saas/public/api/user", {
    headers: {
        "Authorization": "Bearer " + token
    }
})
    .then(res => {
        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
        }
        return res.json();
    })
    .then(data => {
        document.getElementById("username").innerText = data.name;
        console.log(data);
    });


    
/// (DOMContentLoaded)It executes the logout function after the HTML has fully loaded.
document.addEventListener("DOMContentLoaded", function () {

    const logoutBtn = document.getElementById('logoutBtn')
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {

            fetch("http://localhost/gym-saas/public/api/logout", {
                method: 'POST',
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }

            }).then(Response => Response.json())
                .then(data => {
                    // Token remove 
                    localStorage.removeItem("token");
                    alert("Logout success");
                    window.location.href = "/gym-saas/public/frontend/login.html";
                })
                .catch(error => {
                    console.log(error);
                });
        })
    }
});