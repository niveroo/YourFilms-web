import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ReviewMovieCard.css';
import starFilled from '../assets/star-filled.png';
import binIcon from '../assets/bin.png';

const ReviewMovieCard = ({ movie, originalContent, onEdit, onDelete, onUpdate, onCancel, isEditing, isSubmitting }) => {
    const navigate = useNavigate();
    const [tempRating, setTempRating] = useState(movie.rating || 10);
    const [tempContent, setTempContent] = useState(originalContent || '');

    useEffect(() => {
        if (isEditing) {
            setTempRating(movie.rating || 10);
            setTempContent(originalContent || '');
        }
    }, [isEditing, movie.rating, originalContent]);

    const handleClick = () => {
        if (!isEditing) {
            navigate(`/details/${movie.mediaType || 'movie'}/${movie.tmdbId || movie.id}`);
        }
    };

    const handleSave = (e) => {
        e.stopPropagation();
        onUpdate({ rating: tempRating, content: tempContent });
    };

    const imageUrl = movie.posterPath
        ? `https://image.tmdb.org/t/p/w200${movie.posterPath}`
        : 'https://placehold.co/200x300?text=No+Image';

    return (
        <div className={`review-movie-card ${isEditing ? 'editing' : ''}`}>
            <div className="rmc-image-container" onClick={handleClick}>
                <img src={imageUrl} alt={movie.title} loading="lazy" />
            </div>
            <div className="rmc-info">
                <div className="rmc-header" onClick={handleClick}>
                    <div className="rmc-title-wrapper">
                        <h3 className="rmc-title" title={movie.title}>{movie.title}</h3>
                        <span className="rmc-year">
                            ({movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'})
                        </span>
                    </div>
                </div>

                <div className="rmc-rating-section">
                    {isEditing ? (
                        <div className="expanding-rating-selector">
                            <div className="stars-wrapper">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                    <span
                                        key={num}
                                        className={`star-radio ${num <= tempRating ? 'active' : ''}`}
                                        onClick={(e) => { e.stopPropagation(); setTempRating(num); }}
                                        title={`${num}/10`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <span className="rating-number">{tempRating}/10</span>
                        </div>
                    ) : (
                        movie.rating && (
                            <div className="rmc-rating-badge">
                                <img src={starFilled} alt="star" className="rmc-badge-star" />
                                <span>{movie.rating}/10</span>
                            </div>
                        )
                    )}
                </div>

                <div className="rmc-content-scrollable">
                    {isEditing ? (
                        <textarea
                            className="rmc-edit-textarea"
                            value={tempContent}
                            onChange={(e) => setTempContent(e.target.value)}
                            placeholder="Edit your review..."
                            autoFocus
                        />
                    ) : (
                        <p className="rmc-review-text">{originalContent}</p>
                    )}
                </div>

                <div className="rmc-footer">
                    <div className="rmc-actions">
                        {isEditing ? (
                            <>
                                <button
                                    className="rmc-save-btn"
                                    onClick={handleSave}
                                    disabled={isSubmitting || !tempContent.trim()}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    className="rmc-cancel-btn"
                                    onClick={(e) => { e.stopPropagation(); onCancel(); }}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                {onEdit && (
                                    <button className="rmc-edit-btn" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style={{ marginRight: '6px' }}>
                                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                        </svg>
                                        Edit
                                    </button>
                                )}
                                <button className="rmc-trash-btn" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
                                    <img src={binIcon} alt="delete" className="rmc-bin-icon" style={{ marginRight: '6px' }} />
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewMovieCard;
