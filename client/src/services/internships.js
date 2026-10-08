import API from "./api"

// One function per internship endpoint, so components never build URLs.
// Each resolves to the response body.

const body = (res) => res.data;

export const listInternships = (params) => API.get("/api/internships", { params }).then(body);
export const getInternship = (id) => API.get(`/api/internships/${id}`).then(body);
export const createInternship = (data) => API.post("/api/internships", data).then(body);
export const updateInternship = (id, data) => API.put(`/api/internships/${id}`, data).then(body);
export const deleteInternship = (id) => API.delete(`/api/internships/${id}`).then(body);
export const bulkUpdateStatus = (ids, status) => API.put("/api/internships/bulk-status", { ids, status }).then(body);

export const setReminder = (id, reminder) => API.put(`/api/internships/${id}/reminder`, reminder).then(body);
export const clearReminder = (id) => API.delete(`/api/internships/${id}/reminder`).then(body);
export const getStats = () => API.get("/api/internships/stats").then(body);

export const getUpcomingReminders = () => API.get("/api/internships/reminders/upcoming").then(body);
