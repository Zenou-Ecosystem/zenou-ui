import React, { useRef, useState } from 'react';
import { HiUser, HiLockClosed, HiMail, HiArrowSmRight } from "react-icons/hi";
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../core/Button/Button';
import Input from '../../../core/Input/Input';
import { register } from '../../../services/auth.service';
import './register.scss';
import { Toast } from 'primereact/toast';
import { LocalStore } from '../../../utils/storage.utils';
import { UserTypes } from '../../../constants/user.constants';

function Register() {
    const navigator = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cPassword, setCpassword] = useState('');
    const toast = useRef({});

    const signinHandler = async () => {
        const data = await register({ email, username, password, role: UserTypes.ADMIN });
        if (data) {
            (toast.current as any).show(
                {
                    severity: 'success',
                    summary: 'Signup success',
                    detail: 'Account successfully created',
                    life: 5000
                });
            LocalStore.set('token', data?.access_token);
            navigator('/dashboard/home');
        } else {
            (toast.current as any).show(
                {
                    severity: 'error',
                    summary: 'Registration failed',
                    detail: 'Request was unsuccessful',
                    life: 5000
                });
        }
    };

    return (
        <div className='container flex h-screen gap-24'>

            <Toast ref={toast as any} />

            <div className="welcome-container w-1/2 px-20 flex flex-col justify-center items-center">
                <h1 className='welcome-main-text'>
                    The best compliance management and ISO standardization
                    software
                </h1>
                <p className="welcome-small-text text-white">
                    Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Sapiente sit, suscipit
                    reprehenderit voluptate, tenetur error
                    enim iure esse iusto rem, quasi provident
                    quas aliquid asperiores necessitatibus?
                </p>
            </div>
            <div className="signup-section w-1/2 flex flex-col justify-center gap-1">
                <h1 className='register-title'>Create An Account</h1>
                <div className="email-input w-2/3">
                    <label htmlFor='email' className="block">Email</label>
                    <Input type='email'
                        onChange={(email: string) => setEmail(email)}
                        Icon={{
                            classes: 'absolute top-2 left-3',
                            Name: HiMail
                        }} />
                </div>
                <div className="username-input w-2/3">
                    <label htmlFor='username' className="block">Username</label>
                    <Input type='text'
                        onChange={(username: string) => setUsername(username)}
                        Icon={{
                            classes: 'absolute top-2 left-3',
                            Name: HiUser
                        }} />
                </div>
                <div className="password-input w-2/3">
                    <label htmlFor='password' className="block">Password</label>
                    <Input type='password'
                        onChange={(password: string) => setPassword(password)}
                        Icon={{
                            classes: 'absolute top-2 left-3',
                            Name: HiLockClosed
                        }} />
                </div>
                <div className="confirm-pass-input w-2/3">
                    <label htmlFor='cpassword' className="block">Confirm Password</label>
                    <Input type='password'
                        onChange={(cPassword: string) => setCpassword(cPassword)}
                        Icon={{
                            classes: 'absolute top-2 left-3',
                            Name: HiLockClosed
                        }} name='cpassword' id='cpassword' />
                </div>
                <div className="w-2/3 flex justify-between my-2">
                    {/* <div className="remember-me">
                        <input type="checkbox" name="remember-me" id="remember-me" />
                        <label htmlFor="remember-me" className='ml-2'>Remember me</label>
                        <p className='text-yellow-500 cursor-pointer'>
                            Forgot password?
                        </p>
                    </div> */}
                    <span>
                        Already have an account?
                        <Link className='text-blue-500 cursor-pointer' to="/login">Login</Link>
                    </span>
                </div>
                <Button title='Submit' Icon={{
                    classes: 'absolute top-2 left-8',
                    Name: HiArrowSmRight,
                    color: 'white'
                }} onClick={signinHandler} />
            </div>
        </div>
    )
}

export default Register