import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../apicalls/users';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { ShowLoader } from '../../redux/loaderSlice';
import { HideLoader } from '../../redux/loaderSlice';

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
    });

    const register = async () => {
        try {
            dispatch(ShowLoader());
            const response = await registerUser(user);
            dispatch(HideLoader());
            if (response.success) {
                toast.success(response.message);
                navigate("/login");

            } else {
                toast.error(response.message);
                dispatch(HideLoader());
            }
        } catch (error) {
            toast.error(error.message);
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
                <h1 className='text-2xl uppercase text-primary'>Chat Register</h1>
                <hr />
                <input
                    type='text'
                    placeholder='Enter your name'
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
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
                    onClick={register}
                >
                    Register
                </button>
                <Link
                    to="/login"
                    className='underline'
                >
                    Already have account? Login
                </Link>
            </div>
        </div>
    )
}

export default Register