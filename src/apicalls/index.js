import axios from 'axios';
export const axiosInstance = axios.create();

// intercepting every request
axiosInstance.interceptors.request.use(config => {
    config.headers['authorization'] = `Bearer ${localStorage.getItem('token')}`;
    config.headers['accepts'] = "application/json"
    return config;
});