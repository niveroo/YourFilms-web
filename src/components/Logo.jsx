import { useNavigate } from 'react-router-dom';
import '/src/styles/Logo.css'
import icon from '../assets/icon.png';

const Logo = () => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/');
    };

    return (
        <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer', color: 'white' }}>
            <img src={icon} alt="Logo" className="logo-icon" />
            <h2>YourFilms</h2>
        </div>
    );
};

export default Logo;