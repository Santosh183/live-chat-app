import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sendMessage, getMessages } from '../../../apicalls/messages';
import { clearChatMessages } from '../../../apicalls/chats';
import { HideLoader, ShowLoader } from '../../../redux/loaderSlice';
import toast from 'react-hot-toast';
import moment from 'moment'
import { setCurrentChat, setChats } from '../../../redux/userSlice';

function ChatArea() {
    const { currentChat, allChats, user, users, userProfileColors } = useSelector(state => state.userReducer);
    const dispatch = useDispatch();
    const [newMessage, setNewMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const receipent = currentChat.members.find(
        (mem) => mem._id !== user._id
    );
    const receipentUser = users.find(u => u._id === receipent._id);
    const sendNewMessage = async () => {
        try {
            dispatch(ShowLoader());
            const message = {
                chat: currentChat._id,
                sender: user._id,
                text: newMessage,
            }
            const response = await sendMessage(message);

            if (response.success) {
                setNewMessage('');
                toast.success('Sent Message successfully');
                dispatch(HideLoader());
            } else {
                toast.error(response.message);
                dispatch(HideLoader());
            }
        } catch (error) {
            dispatch(HideLoader());
            toast.error(error.message);
        }
    }

    const getChatMessages = async () => {
        try {
            dispatch(ShowLoader());
            const response = await getMessages(currentChat._id);

            if (response.success) {
                setChatMessages(response.data);
                dispatch(HideLoader());
            } else {
                toast.error(response.message);
                dispatch(HideLoader());
            }
        } catch (error) {
            dispatch(HideLoader());
            toast.error(error.message);
        }

    }

    const clearUnreadMessages = async () => {
        try {
            dispatch(ShowLoader());
            const response = await clearChatMessages(currentChat._id);
            dispatch(HideLoader());
            if (response.success) {
                const updatedAllChats = allChats.map((chat) => {
                    if (chat._id === currentChat._id) {

                        return response.data;
                    }
                    return chat;
                });
                dispatch(setChats(updatedAllChats));
            }
        } catch (error) {
            dispatch(HideLoader());
            toast.error(error.message);
        }
    }

    useEffect(() => {
        getChatMessages();
        if (currentChat.lastMessage?.sender !== user._id) {
            clearUnreadMessages();
        }
    }, [currentChat])

    return (
        <div className='w-full bg-white h-[88vh] rounded-xl flex flex-col justify-between p-5'>
            <div>
                <div className='flex gap-5 items-center mb-2'>
                    {
                        receipentUser.profilePic && (
                            <img
                                src={receipentUser.profilePic}
                                alt='profile pic'
                                className='w-10 h-10 rounded-full'
                            />
                        )
                    }
                    {
                        !receipentUser.profilePic && (
                            <div
                                className='rounded-full h-10 w-10 flex items-center justify-center'
                                style={{ background: userProfileColors[receipentUser._id] }}
                            >
                                <h1 className='uppercase text-xl font-semibol text-white'>
                                    {receipentUser.name[0]}
                                </h1>
                            </div>
                        )
                    }
                    <h1 className='uppercase'>{receipentUser.name}</h1>
                </div>
                <hr />
            </div>
            <div className='h-[65vh] pr-3 overflow-auto'>
                <div className='flex flex-col gap-5'>
                    {chatMessages.map(
                        (message) => {
                            const isCurrentUserIsSender = message.sender === user._id;
                            return <div
                                className={`flex ${isCurrentUserIsSender ? 'justify-end' : 'justify-start'} `}
                                key={message._id}
                            >
                                <div className='w-[40%] flex flex-col'>
                                    <h1 className={`px-5 py-3 ${isCurrentUserIsSender ? 'rounded-tr-none bg-primary text-white' : 'bg-gray-300 rounded-tl-none text-primary'} p-2 rounded-xl`}>{message.text}</h1>
                                    {isCurrentUserIsSender && <i className={`ri-check-double-line self-end ${isCurrentUserIsSender && message.read ? 'text-blue-400' : 'text-gray-400'}`}></i>}
                                    <h1 className='self-end text-xs text-gray-500'>{moment(message.createdAt).format('MMMM Do YYYY, h:mm a')}</h1>
                                </div>
                            </div>
                        }
                    )}
                </div>
            </div>
            <div className='h-16 rounded border-2 border-gray-400 shadow flex justify-between items-center p-2'>
                <input type='text' placeholder="Type a message"
                    className='w-[95%] border-0 h-full focus:border-none'
                    value={newMessage}
                    onChange={(event) => setNewMessage(event.target.value)}
                />
                <button
                    className=' h-max bg-primary text-white p-2 rounded'
                    onClick={sendNewMessage}
                >
                    <i className="ri-send-plane-2-line text-white"></i>
                </button>
            </div>
        </div>
    )
}

export default ChatArea