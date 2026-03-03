import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/slices/userSlice";
import "../styles/AuthButton.css"

const AuthButton = () => {
    const { isLoggedIn, user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleLoginClick = () => {
        navigate(`/login`);
    };

    const handleLogoutClick = async () => {
        await dispatch(logout());
        navigate("/");
    };

    return (
        <div className="auth-container">
            {isLoggedIn ? (
                <>
                    <span className="username-link" onClick={handleProfileClick}>
                        {user?.username || "Profile"}
                    </span>
                    <button className="logout-btn" onClick={handleLogoutClick}>Log Out</button>
                </>
            ) : (
                <button className="login-btn" onClick={handleLoginClick}>Login</button>
            )}
        </div>
    );
}

export default AuthButton;
