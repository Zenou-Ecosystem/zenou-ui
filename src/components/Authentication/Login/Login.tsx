import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmailChange = (e: any) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: any) => {
        setPassword(e.target.value);
    };

    const handleLogin = (e: any) => {
        e.preventDefault();
        // Add your login logic here
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-6 bg-gray-200">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                <div className="p-4 sm:p-5 md:p-6">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Login</h1>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4 sm:mb-5 md:mb-6">
                            <div className="flex items-center border-b-2 border-gray-300 py-2">
                                <FaUser className="text-gray-500" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="ml-2 text-gray-700 font-semibold placeholder-gray-500 outline-none"
                                    value={email}
                                    onChange={handleEmailChange}
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <div className="flex items-center border-b-2 border-gray-300 py-2">
                                <FaLock className="text-gray-500" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="ml-2 text-gray-700 font-semibold placeholder-gray-500 outline-none"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-indigo-500 text-white py-3 rounded-md hover:bg-indigo-600 transition duration-200">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
