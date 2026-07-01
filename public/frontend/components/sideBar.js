export function sidebar() {
    return `
        <div class="bg-dark text-white vh-100">
            <ul class="nav flex-column p-3">
                <li class="nav-item mb-2 border-bottom border-info">
                    <a class="nav-link text-white" href="/gym-saas/public/frontend/dashboard.html"><i class="bi bi-speedometer2"></i> Dashboard</a>
                </li>
                <li class="nav-item mb-2 border-bottom border-info" id="createUser" style="display: none;">
                    <a class="nav-link text-white" href="/gym-saas/public/frontend/users/user.html"><i class="bi bi-person-circle"></i> User</a>
                </li>
                <li class="nav-item mb-2 border-bottom border-info">
                    <a class="nav-link text-white" href="/gym-saas/public/frontend/members/member.html"><i class="bi bi-person-lines-fill"></i> Members</a>
                </li>
                <li class="nav-item mb-2 border-bottom border-info">
                    <a class="nav-link text-white" href="/gym-saas/public/frontend/plans/plan.html"><i class="bi bi-calendar2-check"></i> Plans</a>
                </li>
                <li class="nav-item mb-2 border-bottom border-info">
                   <a class="nav-link text-white" href="/gym-saas/public/frontend/gymProfile/gym.html"><i class="bi bi-shop"></i>Gym Profile</a>
                </li>
            </ul>
        </div>
     `;
}