import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../apicalls/users';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { ShowLoader } from '../../redux/loaderSlice';
import { HideLoader } from '../../redux/loaderSlice';

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    const login = async () => {
        try {
            dispatch(ShowLoader());
            const response = await loginUser(user);
            dispatch(HideLoader());
            if (response.success) {
                toast.success(response.message);
                localStorage.setItem('token', response.data);
                navigate("/");
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.success(error.message);
            dispatch(HideLoader());
        }

    };
    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate("/");
        }
    }, [])
    return (
        <div className='h-screen flex items-center justify-center bg-primary'>
            <div className="bg-white shadow-md p-5 flex flex-col gap-5 w-96">
                <h1 className='text-2xl uppercase text-primary'>Chat Login</h1>
                <hr />
                <input
                    type='email'
                    placeholder='Enter your email'
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
                <input
                    type='password'
                    placeholder='Enter your password'
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                />
                <button
                    className='contained-btn'
                    onClick={login}
                >
                    Login
                </button>
                <Link
                    to="/register"
                    className='underline'
                >
                    Don't have account? Register
                </Link>
            </div>
        </div>
    )
}

export default Login