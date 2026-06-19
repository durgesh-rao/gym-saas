import { getToken } from "./config.js";

export async function createMember(data) {
    const response = await fetch(
        "http://localhost/gym-saas/public/api/members/add",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(data),
        },
    );

    const result = await response.json();

    if (!response.ok) {
        throw result;
    }

    return result;
}

export async function getMember(searchValue = "", page = 1) {
    const response = await fetch(
        `http://localhost/gym-saas/public/api/members?search=${searchValue}&page=${page}`,
        {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        },
    );
    if (response.status === 403) {
        const error = new Error("Access denied");
        error.status = 403;
        throw error;
    }
    if (!response.ok) {
        throw new Error("API Error: " + response.status);
    }

    return response.json();
}

//fetch member for update form
export async function fetchMemberData(id) {
    const response = await fetch(
        `http://localhost/gym-saas/public/api/members/fetch/${id}`,
        {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        },
    );
    if (!response.ok) {
        throw new Error("API Error: " + response.status);
    }
    return response.json();
}

export async function updateMember(id, data) {
    const response = await fetch(
        `http://localhost/gym-saas/public/api/members/update/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(data),
        },
    );
    if (!response.ok) {
        throw new Error("API Error: " + response.status);
    }
    return response.json();
}

export async function deleteMember(id) {
    const response = await fetch(
        `http://localhost/gym-saas/public/api/members/delete/${id}`,
        {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        },
    );
    if (!response.ok) {
        throw new Error("API Error: " + response.status);
    }
    return response.json();
}

////get gyms for form

export async function getGyms() {
    const response = await fetch(
        `http://localhost/gym-saas/public/api/members/gyms/list`,
        {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        },
    );

    if (!response.ok) {
        throw new Error("API Error: " + response.status);
    }
    return response.json();
}

export async function fetchPlans(gymId) {
    const response = await fetch(
        `http://localhost/gym-saas/public/api/members/plans?gym_id=${gymId}`,
        {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        },
    );

    if (!response.ok) {
        throw new Error("API Error: " + response.status);
    }
    return response.json();
}
