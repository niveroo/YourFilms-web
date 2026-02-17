import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeUser, login } from '../store/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.user);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(login({ username, password, rememberMe })).unwrap();
        await dispatch(initializeUser()).unwrap();
        navigate(`/profile`);
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <div>
                <label>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <div className="checkbox-class">
                <input type="checkbox" id="rememberMe" />
                <label>Remember me</label>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </form>
    );
};

export default Login;
