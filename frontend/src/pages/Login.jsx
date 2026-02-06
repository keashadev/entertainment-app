import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { getApiUrl } from '../utils/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(getApiUrl('/api/auth/login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            login(data.user, data.token);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-darkBlue flex items-center justify-center p-6">
            <div className="bg-semiDarkBlue p-8 rounded-2xl w-full max-w-md">
                <img src="/assets/logo.svg" alt="Logo" className="mx-auto mb-14 w-8 h-8" />

                <h1 className="heading-l mb-10 text-white">Login</h1>

                {error && <p className="text-red body-m mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-transparent border-b border-greyishBlue p-4 text-white body-m focus:outline-none focus:border-white caret-red pl-4"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-transparent border-b border-greyishBlue p-4 text-white body-m focus:outline-none focus:border-white caret-red pl-4"
                    />

                    <button type="submit" className="bg-red text-white py-4 rounded-lg hover:bg-white hover:text-darkBlue transition-colors body-m mt-4">
                        Login to your account
                    </button>
                </form>

                <p className="text-white text-center mt-6 body-m">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-red hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
