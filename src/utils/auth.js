export const getToken = () => localStorage.getItem('token');

export const setToken = (token) => localStorage.setItem('token', token);

export const removeToken = () => localStorage.removeItem('token');

export const isAuthenticated = () => !!getToken();

export const getProjectId = () => localStorage.getItem('projectId');

export const setProjectId = (projectId) => localStorage.setItem('projectId', projectId);

export const removeProjectId = () => localStorage.removeItem('projectId');