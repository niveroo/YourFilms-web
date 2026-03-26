import { useNavigate } from 'react-router-dom';
import '../styles/BookmarkMovieCard.css';
import starFilled from '../assets/star-filled.png';
import BookmarkMenu from './BookmarkMenu';

const BookmarkMovieCard = ({ movie, onStatusChange, category, isFavorite, children }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/details/${movie.mediaType || 'movie'}/${movie.tmdbId || movie.id}`);
    };

    const imageUrl = movie.posterPath
        ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
        : 'https://placehold.co/500x750?text=No+Image';

    return (
        <div className="profile-movie-card">
            <div className="bmc-image-container" onClick={handleClick}>
                <img src={imageUrl} alt={movie.title} loading="lazy" />
            </div>
            <div className="bmc-info">
                <div className="bmc-main-info" onClick={handleClick}>
                    <h3 className="bmc-title">{movie.title}</h3>
                    <div className="bmc-subtitle">
                        <span className="bmc-year">
                            {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}
                        </span>
                        {movie.rating && (
                            <div className="bmc-rating">
                                <img src={starFilled} alt="star" className="bmc-rating-star" /> {movie.rating}/10
                            </div>
                        )}
                    </div>
                </div>

                {children && <div className="bmc-content">{children}</div>}

                <div className="bmc-footer">
                    <BookmarkMenu
                        bookmarkStatus={{ category, isFavorite }}
                        isLoggedIn={true}
                        onSave={(newStatus) => onStatusChange && onStatusChange(newStatus)}
                    />
                </div>
            </div>
        </div>
    );
};

export default BookmarkMovieCard;
