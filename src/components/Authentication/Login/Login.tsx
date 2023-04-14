import React, { useRef, useState } from 'react';
import { HiUser, HiLockClosed, HiMail, HiArrowSmRight } from "react-icons/hi";
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../core/Button/Button';
import Input from '../../../core/Input/Input';
import { login } from '../../../services/auth.service';
import '../Register/register.scss';
import { Toast } from 'primereact/toast';


function Login() {
    const navigator = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const toast = useRef({});


    const signinHandler = async () => {
        const data = await login({ email, password });
        if (data && data?.access_token) {
            (toast.current as any).show(
                {
                    severity: 'success',
                    summary: 'Login success',
                    detail: 'Welcome back',
                    life: 5000
                });
            navigator('/dashboard/home', { replace: true });
        } else {
            (toast.current as any).show(
                {
                    severity: 'error',
                    summary: 'Login failed',
                    detail: data?.message ?? 'Request was unsuccessful',
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
                <h1 className='register-title'>Login</h1>
                <div className="email-input w-2/3">
                    <label htmlFor='email' className="block">Email</label>
                    <Input type='email'
                        onChange={(email: string) => setEmail(email)}
                        Icon={{
                            classes: 'absolute top-2 left-3',
                            Name: HiMail
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


                <div className="w-2/3 flex justify-between my-2">
                    <div className="remember-me">
                        <input type="checkbox" name="remember-me" id="remember-me" />
                        <label htmlFor="remember-me" className='ml-2'>Remember me</label>
                        <p className='text-yellow-500 cursor-pointer'>
                            Forgot password?
                        </p>
                    </div>
                    <span>
                        Don't have an account yet?
                        <Link className='text-blue-500 cursor-pointer' to="/register">Signup</Link>
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

export default Login