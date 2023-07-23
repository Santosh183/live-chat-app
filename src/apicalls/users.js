import { axiosInstance } from "./index";
export const loginUser = async (user) => {
    try {
        const response = await axiosInstance.post('http://localhost:5000/api/users/login', user);
        return response.data;
    } catch (error) {
        return error;
    }
}
export const registerUser = async (user) => {
    try {
        const response = await axiosInstance.post('http://localhost:5000/api/users/register', user);
        return response.data;
    } catch (error) {
        return error;
    }

}

export const getCurrentUser = async () => {
    try {
        const response = await axiosInstance.get('http://localhost:5000/api/users/get-current-user');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get('http://localhost:5000/api/users/get-all-users');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}