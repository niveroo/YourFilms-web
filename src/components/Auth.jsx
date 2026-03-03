import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeUser, login, register } from '../store/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);

    // Form states
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    // Local error state for password matching
    const [formError, setFormError] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.user);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(''); // clear any previous local errors

        if (isLogin) {
            // LOGIN FLOW
            try {
                await dispatch(login({ username, password, rememberMe })).unwrap();
                await dispatch(initializeUser()).unwrap();
                navigate(`/profile`);
            } catch (err) {
                // error is handled and displayed via Redux state
            }
        } else {
            // REGISTER FLOW
            if (password !== confirmPassword) {
                setFormError('Passwords do not match.');
                return;
            }

            try {
                await dispatch(register({ username, email, password })).unwrap();
                // If successful, log them in immediately or flip to login screen seamlessly
                setIsLogin(true);
                // Optionally clear password so they type it again to log in, or auto-login
                setPassword('');
                setConfirmPassword('');
                alert('Registration successful! Please log in.');
            } catch (err) {
                // error is handled and displayed via Redux state
            }
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormError('');
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>

            <div className="input-group">
                <label>Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>

            {!isLogin && (
                <div className="input-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
            )}

            <div className="input-group">
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            {!isLogin && (
                <div className="input-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
            )}

            {isLogin && (
                <div className="checkbox-class">
                    <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="rememberMe">Remember me</label>
                </div>
            )}

            {formError && <p className="error-text">{formError}</p>}
            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
            </button>

            <div className="auth-footer">
                <span onClick={toggleMode} className="toggle-link">
                    {isLogin
                        ? "Don't have an account? Register"
                        : "Already have an account? Login"}
                </span>
            </div>
        </form>
    );
};

export default Auth;
