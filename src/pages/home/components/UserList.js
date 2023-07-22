import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createChat } from '../../../apicalls/chats';
import { setChats, setCurrentChat } from '../../../redux/userSlice';
import { HideLoader, ShowLoader } from '../../../redux/loaderSlice';
import toast from 'react-hot-toast';
import moment from 'moment';

function UserList({ searchKey }) {
    const { users, user, allChats, currentChat, userProfileColors } = useSelector(state => state.userReducer);
    const dispatch = useDispatch();
    const createNewChat = async (event, receipent) => {
        try {
            event.stopPropagation();
            dispatch(ShowLoader());
            const response = await createChat([user._id, receipent._id]);
            dispatch(HideLoader());
            if (response.success) {
                toast.success('Created chat successfully')
                const newChat = response.data;
                const updatedChats = [...allChats, newChat]
                dispatch(setChats(updatedChats));
                dispatch(setCurrentChat(newChat));
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            dispatch(HideLoader());
            toast.error(error.message);
        }
    };
    const selectChat = (userItem) => {
        const chat = allChats.find((chat) => chat.members.map(m => m._id).includes(userItem._id) && chat.members.map(m => m._id).includes(user._id));
        if (chat) {
            dispatch(setCurrentChat(chat));
        }
    };
    const getData = () => {

        if (searchKey.trim() === '') {
            return allChats;
        } else {
            return users.filter((user) => user.name.toLowerCase().includes(searchKey.toLowerCase()));
        }

    };

    const isSelectedChat = (userItem) => {
        if (currentChat) {
            // we know one of member is logged in user so is other user is from list then highlight it 
            return currentChat.members.map(m => m._id).includes(userItem._id);
        }
    };

    const getLastMessage = (userItem) => {
        const chat = allChats.find((chat) => {
            return chat.members.map(m => m._id).includes(userItem._id);
        });
        if (chat && chat.lastMessage) {
            const sender = chat.lastMessage.sender === user._id ? 'You: ' : '';
            return <div className='text-xs flex flex-col'>
                <span className='text-xs text-gray-600'>{sender + chat.lastMessage.text}</span>
                <span className='text-xs self-end text-gray-400'>{moment(chat.lastMessage.createdAt).format('MMMM Do YYYY, h:mm a')}</span>
            </div>
        } else {
            return '';
        }
    }
    const getUnreadMessagesCount = (userItem) => {
        const chat = allChats.find((chat) => {
            return chat.members.map(m => m._id).includes(userItem._id);
        });
        if (chat && chat.unreadMessagesCount && chat.lastMessage.sender !== user._id) {
            return <div className='bg-green-700 text-white rounded-full p-1 self-end flex items-center justify-center text-xs h-[20px] w-[20px]'>
                {chat.unreadMessagesCount}
            </div>
        } else {
            return '';
        }
    }

    return (
        <div
            className='flex gap-2 flex-col mt-5'
        >
            {
                getData().map((userOrChat) => {
                    let userItem = userOrChat;
                    if (userOrChat.members) {
                        userItem = userOrChat.members.find((mem) => mem._id !== user._id);
                    }
                    return (
                        <div
                            className={`cursor-pointer shadow-sm rounded-xl border p-5 bg-white flex justify-between items-center
                            ${isSelectedChat(userItem) ? 'bg-purple-200' : ''}`}
                            key={userItem._id}
                            onClick={() => selectChat(userItem)}
                        >
                            <div className='flex gap-5 items-center'>
                                {
                                    userItem.profilePic && (
                                        <img
                                            src={userItem.profilePic}
                                            alt='profile pic'
                                            className='w-10 h-10 rounded-full'
                                        />
                                    )
                                }
                                {
                                    !userItem.profilePic && (
                                        <div
                                            className='rounded-full h-10 w-10 flex items-center justify-center'
                                            style={{ background: userProfileColors[userItem._id] }}
                                        >
                                            <h1 className='uppercase text-xl font-semibol text-white'>
                                                {userItem.name[0]}
                                            </h1>
                                        </div>
                                    )
                                }
                                <div className='flex flex-col gap-1'>
                                    <div className='flex justify-between'>
                                        <h1>{userItem.name}</h1>
                                        {getUnreadMessagesCount(userItem)}
                                    </div>
                                    {getLastMessage(userItem)}
                                </div>
                            </div>
                            <div
                                onClick={(e) => createNewChat(e, userItem)}
                            >
                                {
                                    !allChats.find((chat) => chat.members.map(m => m._id).includes(userItem._id)) && (
                                        <button className='border-primary border p-1 text-xs h-auto text-primary bg-white rounded cursor-pointer' >
                                            Connect
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                    );
                })
            }
        </div >
    )
}

export default UserList