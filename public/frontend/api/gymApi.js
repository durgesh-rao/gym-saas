import { getToken } from "./config.js";

export async function createGym(data) {
    const response = await fetch(
        "http://localhost/gym-saas/public/api/gyms/add",
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

    if (!response.ok) {
        throw new Error("API Error: " + response.status);
    }
    return response.json();
}

export async function getGym(searchValue = "", page = 1) {
    const response = await fetch(
        `http://localhost/gym-saas/public/api/gyms?search=${searchValue}&page=${page}`,
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

//fetch gym for update
export async function fetchGymData(id) {
    const response = await fetch(
        `http://localhost/gym-saas/public/api/gyms/fetch/${id}`,
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

export async function updateGym(id, data) {
    const response = await fetch(
        `http://localhost/gym-saas/public/api/gyms/update/${id}`,
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

export async function deleteGym(id) {
    const response = await fetch(
        `http://localhost/gym-saas/public/api/gyms/delete/${id}`,
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
