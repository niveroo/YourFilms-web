import { useNavigate } from 'react-router-dom';
import '../styles/ProfileMovieCard.css';
import starFilled from '../assets/star-filled.png';
import binIcon from '../assets/bin.png';


const ProfileMovieCard = ({ movie, onEdit, onDelete, category, isFavorite, isEditing, children }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/details/${movie.mediaType || 'movie'}/${movie.tmdbId || movie.id}`);
    };

    const imageUrl = movie.posterPath
        ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
        : 'https://placehold.co/500x750?text=No+Image';

    return (
        <div className="profile-movie-card">
            <div className="pmc-image-container" onClick={handleClick}>
                <img src={imageUrl} alt={movie.title} loading="lazy" />
            </div>
            <div className="pmc-info">
                <div className="pmc-main-info" onClick={handleClick}>
                    <h3 className="pmc-title">{movie.title}</h3>
                    <div className="pmc-subtitle">
                        <span className="pmc-year">
                            {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}
                        </span>
                        {movie.rating && (
                            <div className="pmc-rating">
                                <img src={starFilled} alt="star" className="pmc-rating-star" /> {movie.rating}/10
                            </div>
                        )}

                    </div>
                </div>

                {children && <div className="pmc-content">{children}</div>}

                {!isEditing && (
                    <div className="pmc-footer">
                        <div className="pmc-meta">
                            {category && <span className="pmc-category-badge">{category}</span>}
                            {isFavorite && <img src={starFilled} alt="favorite" className="pmc-star-icon" />}
                        </div>

                        <div className="pmc-actions">
                            {onEdit && (
                                <button className="pmc-edit-btn" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                                    <div className="edit-pill"></div>
                                </button>
                            )}
                            {onDelete && (
                                <button className="pmc-trash-btn" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
                                    <img src={binIcon} alt="delete" className="pmc-bin-icon" />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileMovieCard;
