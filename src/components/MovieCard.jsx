import { useNavigate } from 'react-router-dom';
import '../styles/MovieCard.css';

const MovieCard = ({ media }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/details/${media.mediaType || 'movie'}/${media.tmdbId || media.id}`);
    };

    const imageUrl = media.posterPath
        ? `https://image.tmdb.org/t/p/w500${media.posterPath}`
        : 'https://via.placeholder.com/500x750?text=No+Image';

    return (
        <div className="movie-card" onClick={handleClick}>
            <div className="card-image-container">
                <img src={imageUrl} alt={media.title || media.name} loading="lazy" />
                <div className="card-overlay">
                    <button className="card-btn">Details</button>
                </div>
            </div>
            <div className="card-info">
                <h3>{media.title || media.name}</h3>
                <div className="card-meta">
                    <span>{new Date(media.releaseDate || media.firstAirDate).getFullYear() || 'N/A'}</span>
                    <span className="rating">⭐ {media.voteAverage?.toFixed(1)}</span>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
