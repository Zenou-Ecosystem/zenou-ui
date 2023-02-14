import React from 'react'
import './register.scss';

function Register() {
    return (
        <div className='container flex'>
            <div className="welcome-text w-1/2 text-white">
                The best compliance management and ISO standardization software
            </div>
            <div className="signup-section w-1/2">
                <h1 className=''>Create An Account</h1>
                <div className="email-input">
                    <label htmlFor='email'>Email</label>
                    <input type="email" name='email' />
                </div>
                <div className="username-input">
                    <label htmlFor='username'>Username</label>
                    <input type="text" name='username' />
                </div>
                <div className="password-input">
                    <label htmlFor='password'>Password</label>
                    <input type="password" name='password' />
                </div>
                <div className="confirm-pass-input">
                    <label htmlFor='cpassword'>Confirm Password</label>
                    <input type="password" name='cpassword' />
                </div>
            </div>
        </div>
    )
}

export default Register