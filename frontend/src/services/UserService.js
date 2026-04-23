const API_URL = "http://localhost:8080/api/users";

export const getUserById = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch user");
    }
    return await response.json();
};