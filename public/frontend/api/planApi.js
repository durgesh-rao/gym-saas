import { getToken } from "./config.js";

export async function createPlan(data) {
    const response = await fetch(
        "http://localhost/gym-saas/public/api/plans/add",
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
        console.log(result);
        throw new Error(result.message || "API Error");
    }

    return result;
}

export async function getPlan(searchValue = "", page = 1) {
    const response = await fetch(
        `http://localhost/gym-saas/public/api/plans?search=${searchValue}&page=${page}`,
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

export async function fetchPlansData(id) {
    const response = await fetch(
        `http://localhost/gym-saas/public/api/plans/fetch/${id}`,
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

export async function updatePlan(id, data) {
    const response = await fetch(
        `http://localhost/gym-saas/public/api/plans/update/${id}`,
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

export async function deletePlan(id) {
    const response = await fetch(
        `http://localhost/gym-saas/public/api/plans/delete/${id}`,
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

export async function getGyms() {
    const response = await fetch(
        `http://localhost/gym-saas/public/api/plans/gyms/list`,
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
