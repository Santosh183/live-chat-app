import React, { useEffect } from 'react'
import { getCurrentUser, getAllUsers } from '../apicalls/users'
import { getAllChats } from '../apicalls/chats'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { ShowLoader } from '../redux/loaderSlice';
import { HideLoader } from '../redux/loaderSlice';
import { setChats, setUser, setUsers, setUserProfileColors } from '../redux/userSlice';

function ProtectedRoute({ children }) {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.userReducer);
    const navigate = useNavigate();
    const randomColorHex = () => {
        const hexString = `${Math.random().toString(16)}000000`.slice(2, 8);
        return `#${hexString}`;
    }

    const getUser = async () => {
        try {
            dispatch(ShowLoader());
            const userResponse = await getCurrentUser();
            const allUsersResponse = await getAllUsers();
            const allChatResponse = await getAllChats();
            dispatch(HideLoader());
            if (userResponse.success && allUsersResponse.success) {
                dispatch(setUser(userResponse.data));
                const userColorCodes = {};
                for (let i = 0; i < allUsersResponse.data.length; i++) {
                    if (!userColorCodes[allUsersResponse.data[i]._id]) {
                        userColorCodes[allUsersResponse.data[i]._id] = randomColorHex();
                    }
                }
                dispatch(setUserProfileColors(userColorCodes));
                dispatch(setUsers(allUsersResponse.data));
                dispatch(setChats(allChatResponse.data));
                return true;
            } else {
                localStorage.removeItem('token');
                navigate('/login');
                toast.error('Invalid Token');
                return false;
            }
        } catch (error) {
            navigate('/login');
            toast.error(error.message);
            return false;
        }
    }
    const logout = () => {
        dispatch(ShowLoader());
        setTimeout(() => {
            localStorage.removeItem('token');
            dispatch(HideLoader());
            navigate('/login');
        }, 500)

    }

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getUser();
        } else {
            navigate('/login');
        }
    }, [])



    return (
        <div className='h-screen w-screen bg-gray-100 p-2'>
            <div className='flex justify-between p-5 bg-primary text-white'>
                <div className='flex items-center gap-1'>
                    <i className="ri-message-2-line text-2xl text-white"></i>
                    <h1 className='text-2xl uppercase font-bold text-white'>Live Chat</h1>
                </div>
                <div className='flex text-md gap-1 items-center'>
                    <i className="ri-shield-user-line "></i>
                    <h1 className='underline'>{user?.name}</h1>
                    <i
                        className="ri-logout-circle-r-line ml-3 text-xl cursor-pointer"
                        onClick={() => logout()}
                    ></i>
                </div>

            </div>
            <div>
                {children}
            </div>
        </div>
    )
}

export default ProtectedRoute