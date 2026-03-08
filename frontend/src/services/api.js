import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error)=> Promise.reject(error)
);

export const login = (email, password) => 
    api.post('/auth/login', {email, password});

export const register = (email, password, name) => 
    api.post('/auth/register', {email, password, name});

export const getInventories = () =>
    api.get('/inventories');

export const getInventory = (id) =>
    api.get(`/inventories/${id}`);

export const createInventory = (data) =>
    api.post('inventories', data);

export const updateInventory = (id, data) =>
    api.put(`inventories/${id}`, data);

export const deleteInventory = (id) =>
    api.delete(`/inventories/${id}`);

export default api;