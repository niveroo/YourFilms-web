import { useNavigate } from 'react-router-dom';
import '../styles/ReviewMovieCard.css';
import starFilled from '../assets/star-filled.png';

const ReviewMovieCard = ({ movie, onEdit, onDelete, isEditing, children }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/details/${movie.mediaType || 'movie'}/${movie.tmdbId || movie.id}`);
    };

    const imageUrl = movie.posterPath
        ? `https://image.tmdb.org/t/p/w200${movie.posterPath}`
        : 'https://via.placeholder.com/200x300?text=No+Image';

    return (
        <div className="review-movie-card">
            <div className="rmc-image-container" onClick={handleClick}>
                <img src={imageUrl} alt={movie.title} loading="lazy" />
            </div>
            <div className="rmc-info">
                <div className="rmc-header">
                    <div className="rmc-title-group" onClick={handleClick}>
                        <h3>{movie.title}</h3>
                        <div className="rmc-subtitle">
                            <span className="rmc-year">
                                {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}
                            </span>
                            {movie.rating && (
                                <div className="rmc-rating">
                                    <img src={starFilled} alt="star" className="rmc-rating-star" /> {movie.rating}/10
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                <div className="rmc-content">{children}</div>

                {!isEditing && (
                    <div className="rmc-footer">
                        <div className="rmc-actions">
                            {onEdit && (
                                <button className="rmc-edit-btn" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style={{ marginRight: '6px' }}>
                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                    </svg>
                                    Edit
                                </button>
                            )}
                            {onDelete && (
                                <button className="rmc-trash-btn" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                    </svg>
                                </button>
                            )}

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewMovieCard;
