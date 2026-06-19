export function navbar() {
    return `
<nav class="navbar navbar-dark bg-info shadow">
    <div class="container-fluid">
        <a class="navbar-brand fw-bold">Owner Dashboard</a>
        <div class="d-flex">
            <span id="username" class="text-white fs-5 fw-medium me-2"></span>
            <button id="logoutBtn" class="btn btn-outline-danger btn-sm d-flex align-items-center gap-1" type="button">Logout</button>
        </div>
    </div>
</nav>
`;
}