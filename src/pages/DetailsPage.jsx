import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import API from '../services/API';
import BookmarkMenu from '../components/BookmarkMenu';
import ReviewItem from '../components/ReviewItem';
import ReviewForm from '../components/ReviewForm';
import './DetailsPage.css';
import '../styles/Reviews.css';
import starFilled from '../assets/star-filled.png';

const DetailsPage = () => {
    const { isLoggedIn, user } = useSelector((state) => state.user);
    const { type, id } = useParams();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [bookmarkStatus, setBookmarkStatus] = useState({}); // { isBookmarked: false, category: '' }
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const fetchReviews = async () => {
        try {
            const reviewsData = await API.getReviews(id, type);
            setReviews(reviewsData || []);
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        }
    };

    useEffect(() => {
        const fetchDetailsAndReviews = async () => {
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
                await fetchReviews();
            } catch (error) {
                console.error("Failed to fetch details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetailsAndReviews();
    }, [type, id]);

    // Independent effect to fetch bookmark status whenever auth state changes
    useEffect(() => {
        const fetchBookmark = async () => {
            if (isLoggedIn) {
                try {
                    const bookmarkData = await API.checkBookmark(id, type);
                    setBookmarkStatus(bookmarkData || {});
                } catch (e) {
                    console.error("User bookmark check failed", e);
                }
            } else {
                setBookmarkStatus({});
            }
        };

        fetchBookmark();
    }, [type, id, isLoggedIn]);

    const handleSaveBookmark = async (newStatus) => {
        try {
            const activeId = bookmarkStatus.id || bookmarkStatus.bookmarkId;

            // 1. Handle Removal
            if (!newStatus.category) {
                if (activeId) {
                    await API.removeBookmark(activeId);
                    setBookmarkStatus({});
                }
                return;
            }

            // 2. Handle Add/Update
            if (activeId) {
                // Update existing
                await API.updateBookmark({
                    bookmarkId: activeId,
                    isFavorite: newStatus.isFavorite,
                    category: newStatus.category
                });
            } else {
                // Add new
                await API.addBookmark({
                    tmdbId: details.id,
                    mediaType: type,
                    isFavorite: newStatus.isFavorite,
                    category: newStatus.category
                });
            }

            // Refresh status from server to ensure sync
            const bookmarkData = await API.checkBookmark(id, type);
            setBookmarkStatus(bookmarkData || {});
        } catch (error) {
            console.error("Failed to save bookmark changes:", error);
            alert("Failed to save changes. Please try again.");
        }
    };

    const handleAddReview = async (reviewData) => {
        setIsSubmittingReview(true);
        try {
            await API.addReview({
                tmdbId: parseInt(id),
                mediaType: type,
                rating: reviewData.rating,
                content: reviewData.content
            });
            await fetchReviews();
        } catch (error) {
            console.error("Failed to add review:", error);
            alert("Failed to add review. " + error.message);
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const handleUpdateReview = async (reviewId, reviewData) => {
        setIsSubmittingReview(true);
        try {
            await API.updateReview(reviewId, {
                reviewId: reviewId,
                rating: reviewData.rating,
                content: reviewData.content
            });
            await fetchReviews();
        } catch (error) {
            console.error("Failed to update review:", error);
            alert("Failed to update review. " + error.message);
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;

        setIsSubmittingReview(true);
        try {
            await API.deleteReview(reviewId);
            await fetchReviews();
        } catch (error) {
            console.error("Failed to delete review:", error);
            alert("Failed to delete review. " + error.message);
        } finally {
            setIsSubmittingReview(false);
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

    // Check if user has already reviewed
    // Match by ID or Username for robust detection
    const userReview = reviews.find(r =>
        (r.userId !== undefined && r.userId === user?.id) ||
        (r.username !== undefined && user?.username !== undefined && r.username === user.username)
    );
    const otherReviews = reviews.filter(r =>
        !((r.userId !== undefined && r.userId === user?.id) ||
            (r.username !== undefined && user?.username !== undefined && r.username === user.username))
    );

    return (
        <div className="details-page">
            <div className="backdrop" style={{ backgroundImage: `url(${backdropUrl})` }}>
                <div className="gradient-overlay"></div>
            </div>

            <div className="content-container">
                <div className="poster-section">
                    <img src={posterUrl} alt={details.title || details.name} />
                    <BookmarkMenu
                        bookmarkStatus={bookmarkStatus}
                        isLoggedIn={isLoggedIn}
                        onSave={handleSaveBookmark}
                    />
                </div>

                <div className="info-section">
                    <h1>{details.title || details.name}</h1>
                    <p className="tagline">{details.tagline}</p>
                    <div className="meta">
                        <span>{year}</span>
                        <span>
                            <img src={starFilled} alt="star" className="star-icon-img" />
                            {details.voteAverage?.toFixed(1)}
                        </span>
                        {runtime ?
                            <span>{runtime} min</span>
                            : <span></span>
                        }
                    </div>

                    <div className="genres">
                        {details.genres?.map(g => (
                            <Link
                                key={g.id}
                                to={`/discover?media_type=${type}&genreId=${g.id}`}
                                className="genre-pill"
                            >
                                {g.name}
                            </Link>
                        ))}
                    </div>

                    <h3>Overview</h3>
                    <p className="overview">{details.overview}</p>

                    {details.seasons && details.seasons.length > 0 && (
                        <div className="seasons-section">
                            <h2>Seasons</h2>
                            <div className="seasons-list">
                                {details.seasons.map((season, index) => (
                                    <div key={`${season.id}-${index}`} className="season-card">
                                        <div className="season-poster">
                                            <img
                                                src={season.posterPath ? `https://image.tmdb.org/t/p/w200${season.posterPath}` : 'https://via.placeholder.com/200x300?text=No+Image'}
                                                alt={season.name}
                                            />
                                        </div>
                                        <div className="season-info">
                                            <div className="season-header-row">
                                                <h3>{season.name}</h3>
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

                {isLoggedIn ? (
                    !userReview && (
                        <ReviewForm
                            onSubmit={handleAddReview}
                            isSubmitting={isSubmittingReview}
                        />
                    )
                ) : (
                    <div className="login-to-review">
                        Please <Link to="/auth" className="login-link">Log In</Link> to leave a review.
                    </div>
                )}

                <div className="reviews-list">
                    {userReview && (
                        <div className="user-review-section">
                            <h3 className="section-label">Your Review</h3>
                            <ReviewItem
                                review={userReview}
                                isOwnReview={true}
                                onUpdate={handleUpdateReview}
                                onDelete={handleDeleteReview}
                                isSubmitting={isSubmittingReview}
                            />
                            {otherReviews.length > 0 && <div className="review-separator"></div>}
                        </div>
                    )}

                    {otherReviews.length > 0 ? (
                        <div className="other-reviews-section">
                            {userReview && <h3 className="section-label">Other Reviews</h3>}
                            {otherReviews.map((review, index) => (
                                <ReviewItem
                                    key={`${review.id}-${index}`}
                                    review={review}
                                    isOwnReview={false}
                                />
                            ))}
                        </div>
                    ) : (
                        !userReview && <p className="no-reviews">No reviews yet. Be the first to review!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailsPage;
