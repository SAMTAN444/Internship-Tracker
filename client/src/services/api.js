import axios from "axios"

const API = axios.create({
    baseURL: "https://internship-tracker-api.onrender.com",
});

// Attach token automatically if it exists
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;