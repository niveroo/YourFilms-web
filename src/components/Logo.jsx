import { useNavigate } from 'react-router-dom';
import '/src/styles/Logo.css'

const Logo = () => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/');
    };

    return (
        <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer', color: 'white' }}>
            <h2>YourFilms</h2>
        </div>
    );
};

export default Logo;