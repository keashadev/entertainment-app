import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== repeatPassword) {
            return setError('Passwords do not match');
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            // login(data.user, data.token); // Requested change: Don't auto-login
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-darkBlue flex items-center justify-center p-6">
            <div className="bg-semiDarkBlue p-8 rounded-2xl w-full max-w-md">
                <img src="/assets/logo.svg" alt="Logo" className="mx-auto mb-14 w-8 h-8" />

                <h1 className="heading-l mb-10 text-white">Sign Up</h1>

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
                    <input
                        type="password"
                        placeholder="Repeat Password"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        className="bg-transparent border-b border-greyishBlue p-4 text-white body-m focus:outline-none focus:border-white caret-red pl-4"
                    />

                    <button type="submit" className="bg-red text-white py-4 rounded-lg hover:bg-white hover:text-darkBlue transition-colors body-m mt-4">
                        Create an account
                    </button>
                </form>

                <p className="text-white text-center mt-6 body-m">
                    Already have an account?{' '}
                    <Link to="/login" className="text-red hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
