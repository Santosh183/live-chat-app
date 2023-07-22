import { axiosInstance } from "./index";


export const getAllChats = async () => {
    try {
        const response = await axiosInstance.get('http://localhost:5000/api/chats/get-all-chats');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const createChat = async (members) => {
    try {
        const response = await axiosInstance.post('http://localhost:5000/api/chats/create-new-chat', { members });
        return response.data;
    } catch (error) {
        return error;
    }

}
export const clearChatMessages = async (chat) => {
    try {
        const response = await axiosInstance.post('http://localhost:5000/api/chats/clear-unread-messages', { chat });
        return response.data;
    } catch (error) {
        return error;
    }

}