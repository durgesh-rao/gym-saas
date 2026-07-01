import { getToken } from "./config.js";

export async function getUsers(searchValue = "", page = 1) {
    const response = await fetch(
        `http://localhost/gym-saas/public/api/users?search=${searchValue}&page=${page}`,
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

export async function createUser(data) {
    const response = await fetch(
        "http://localhost/gym-saas/public/api/users/add",
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

export async function fetchUserData(id) {
    const response = await fetch(
        `http://localhost/gym-saas/public/api/users/fetch/${id}`,
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

export async function updateUser(id, data) {
    const response = await fetch(
        `http://localhost/gym-saas/public/api/users/update/${id}`,
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

export async function deleteUser(id) {
    const response = await fetch(
        `http://localhost/gym-saas/public/api/users/delete/${id}`,
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
