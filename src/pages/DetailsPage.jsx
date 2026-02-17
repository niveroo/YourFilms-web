import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/API';
import './DetailsPage.css';

const DetailsPage = () => {
    const { type, id } = useParams();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [bookmarkStatus, setBookmarkStatus] = useState({}); // { isBookmarked: false, category: '' }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Details
                let detailsData;
                if (type === 'movie') {
                    detailsData = await API.getMovieDetails(id);
                } else if (type === 'tv') {
                    detailsData = await API.getTVDetails(id);
                }
                setDetails(detailsData);

                // Fetch Reviews
                const reviewsData = await API.getReviews(id, type);
                setReviews(reviewsData || []);

                // Check Bookmark
                const bookmarkData = await API.checkBookmark(id, type);
                setBookmarkStatus(bookmarkData || {});
            } catch (error) {
                console.error("Failed to fetch details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [type, id]);

    const handleBookmark = async (category) => {
        try {
            await API.addBookmark({
                tmdbId: details.id, // TMDb ID
                mediaType: type,
                isFavorite: category === 'favorite',
                category: category
            });
            // Refresh status
            const bookmarkData = await API.checkBookmark(id, type);
            setBookmarkStatus(bookmarkData || {});
        } catch (error) {
            console.error("Failed to bookmark:", error);
            alert("Failed to add bookmark. Are you logged in?");
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!details) return <div className="error">Details not found</div>;

    const backdropUrl = details.backdropPath
        ? `https://image.tmdb.org/t/p/original${details.backdropPath}`
        : ''; // Or a default backdrop
    const posterUrl = details.posterPath
        ? `https://image.tmdb.org/t/p/w500${details.posterPath}`
        : 'https://via.placeholder.com/500x750?text=No+Image';

    const releaseDate = details.releaseDate || details.firstAirDate;
    const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
    const runtime = details.runtime || details.episodeRunTime?.[0];

    return (
        <div className="details-page">
            <div className="backdrop" style={{ backgroundImage: `url(${backdropUrl})` }}>
                <div className="gradient-overlay"></div>
            </div>

            <div className="content-container">
                <div className="poster-section">
                    <img src={posterUrl} alt={details.title || details.name} />
                    <div className="actions">
                        <button onClick={() => handleBookmark('wishlist')}>Want to Watch</button>
                        <button onClick={() => handleBookmark('watching')}>Watching</button>
                        <button onClick={() => handleBookmark('watched')}>Watched</button>
                        <button onClick={() => handleBookmark('favorite')} className="favorite">
                            {bookmarkStatus.isFavorite ? '❤️ In Favorites' : '♡ Add to Favorites'}
                        </button>
                    </div>
                </div>

                <div className="info-section">
                    <h1>{details.title || details.name}</h1>
                    <p className="tagline">{details.tagline}</p>
                    <div className="meta">
                        <span>{year}</span>
                        <span>⭐ {details.voteAverage?.toFixed(1)}</span>
                        {runtime ?
                            <span>{runtime} min</span>
                            : <span></span>
                        }
                    </div>

                    <div className="genres">
                        {details.genres?.map(g => <span key={g.id} className="genre-pill">{g.name}</span>)}
                    </div>

                    <h3>Overview</h3>
                    <p className="overview">{details.overview}</p>

                    {/* Cast Section could go here */}

                    {details.seasons && details.seasons.length > 0 && (
                        <div className="seasons-section">
                            <h2>Seasons</h2>
                            <div className="seasons-list">
                                {details.seasons.map(season => (
                                    <div key={season.id} className="season-card">
                                        <div className="season-poster">
                                            <img
                                                src={season.posterPath ? `https://image.tmdb.org/t/p/w200${season.posterPath}` : 'https://via.placeholder.com/200x300?text=No+Image'}
                                                alt={season.name}
                                            />
                                        </div>
                                        <div className="season-info">
                                            <div className="season-header-row">
                                                <h3>{season.name}</h3>
                                                {/* If we wanted to show specific name vs number differentiation, we could do it here, but generally name suffices */}
                                            </div>
                                            <div className="season-meta">
                                                <span className="year">{season.airDate ? new Date(season.airDate).getFullYear() : 'N/A'}</span>
                                                <span className="bullet">•</span>
                                                <span className="episode-count">{season.episodeCount} Episodes</span>
                                            </div>
                                            <div className="season-overview-container">
                                                {season.overview ? (
                                                    <p className="season-overview">{season.overview}</p>
                                                ) : (
                                                    <p className="season-overview no-overview">No overview available.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="reviews-section">
                <h2>Reviews</h2>
                {reviews.length > 0 ? (
                    <div className="reviews-list">
                        {reviews.map(review => (
                            <div key={review.id} className="review-card">
                                <div className="review-header">
                                    <span className="user">{review.userId}</span>
                                    <span className="rating">⭐ {review.rating}/10</span>
                                </div>
                                <p>{review.content}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No reviews yet.</p>
                )}
                {/* Add review form */}
            </div>
        </div>
    );
};

export default DetailsPage;
