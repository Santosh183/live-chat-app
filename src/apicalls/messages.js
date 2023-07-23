import { axiosInstance } from "./index";

export const sendMessage = async (message) => {
    try {
        const response = await axiosInstance.post('http://localhost:5000/api/messages/new-message', message);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getMessages = async (chatId) => {
    try {
        const response = await axiosInstance.get(`http://localhost:5000/api/messages//get-all-messages/${chatId}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}