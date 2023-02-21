import React from 'react';
import { HiUser, HiLockClosed, HiMail, HiArrowSmRight } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import Button from '../../../core/Button/Button';
import Input from '../../../core/Input/Input';
import './register.scss';

function Register() {
    const navigator = useNavigate();
    const signinHandler = () => {
        navigator('/dashboard/home');
    };
    const username = (value: string) => {
        console.log('Username is ', value);

    }
    const email = (value: string) => {
        console.log('Email is ', value);
    }
    const password = (value: string) => {
        console.log('Password is ', value);
    }
    const cPassword = (value: string) => {
        console.log('C-Password is ', value);
    }
    return (
        <div className='container flex h-screen gap-24'>
            <div className="welcome-container w-1/2 px-20 flex flex-col justify-center items-center">
                <h1 className='welcome-main-text'>
                    The best compliance management and ISO standardization
                    software
                </h1>
                <p className="welcome-small-text text-white">
                    Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Sapiente sit, suscipit
                    reprehenderit voluptate, tenetur error enim iure esse iusto rem, quasi provident quae. Unde non possimus
                    quas aliquid asperiores necessitatibus?
                </p>
            </div>
            <div className="signup-section w-1/2 flex flex-col justify-center gap-1">
                <h1 className='register-title'>Create An Account</h1>
                <div className="email-input w-2/3">
                    <label htmlFor='email' className="block">Email</label>
                    <Input type='email' onChange={email} Icon={{
                        classes: 'absolute top-2 left-3',
                        Name: HiMail
                    }} />
                </div>
                <div className="username-input w-2/3">
                    <label htmlFor='username' className="block">Username</label>
                    <Input type='text' onChange={username} Icon={{
                        classes: 'absolute top-2 left-3',
                        Name: HiUser
                    }} />
                </div>
                <div className="password-input w-2/3">
                    <label htmlFor='password' className="block">Password</label>
                    <Input type='password' onChange={password} Icon={{
                        classes: 'absolute top-2 left-3',
                        Name: HiLockClosed
                    }} />
                </div>
                <div className="confirm-pass-input w-2/3">
                    <label htmlFor='cpassword' className="block">Confirm Password</label>
                    <Input type='password' onChange={cPassword} Icon={{
                        classes: 'absolute top-2 left-3',
                        Name: HiLockClosed
                    }} name='cpassword' id='cpassword' />
                </div>
                <div className="w-1/2 flex justify-between my-2">
                    <div className="remember-me flex gap-2">
                        <input type="checkbox" name="remember-me" id="remember-me" />
                        <label htmlFor="remember-me">Remember me</label>
                    </div>
                    <span className='text-yellow-500 cursor-pointer'>Forgot password?</span>
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