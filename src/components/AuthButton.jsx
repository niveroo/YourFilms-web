import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../styles/AuthButton.css"

const AuthButton = () => {
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleLoginClick = () => {
        navigate(`/login`);
    };

    return (
        <div>
            {isLoggedIn ? (
                <button onClick={handleProfileClick}>Profile</button>
            ) : (
                <button onClick={handleLoginClick}>Login</button>
            )}
        </div>
    );
}
export default AuthButton;
