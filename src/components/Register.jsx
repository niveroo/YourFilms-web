import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeUser, register } from '../store/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css'

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.user);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Проверка, что пароль и подтверждение пароля совпадают
        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match.');
            return;
        }

        setPasswordError(''); // Очистить сообщение об ошибке при совпадении паролей

        // Регистрация нового пользователя
        await dispatch(register({ username, email, password })).unwrap();
        navigate(`/login`); // Перенаправление после успешной регистрации
    };

    return (
        <form className="register-form" onSubmit={handleSubmit}>
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
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
            <div>
                <label>Confirm Password:</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>
            {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
            </button>
        </form>
    );
};

export default Register;
