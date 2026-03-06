import { useEffect, useState } from 'react';
import API from '../services/API';
import BookmarkMovieCard from '../components/BookmarkMovieCard';
import ReviewMovieCard from '../components/ReviewMovieCard';

import ReviewForm from '../components/ReviewForm';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [bookmarks, setBookmarks] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('bookmarks'); // 'bookmarks' | 'reviews'
    const [activeCategory, setActiveCategory] = useState('all');
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

    // Inline editing state for reviews
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const categories = [
        { id: 'all', label: 'All' },
        { id: 'wishlist', label: 'Want to watch' },
        { id: 'watching', label: 'Watching' },
        { id: 'watched', label: 'Watched' },
        { id: 'dropped', label: 'Dropped' }
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const userData = await API.getUserData();
            setUser(userData);

            const bookmarksData = await API.getBookmarks();
            setBookmarks(bookmarksData || []);

            const reviewsData = await API.getUserReviews();
            setReviews(reviewsData || []);
        } catch (error) {
            console.error("Failed to fetch profile data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
            alert("Account deletion is not implemented yet.");
        }
    };

    const handleBookmarkStatusChange = async (b, newStatus) => {
        try {
            if (!newStatus.category) {
                // Delete
                await API.removeBookmark(b.id);
                setBookmarks(prev => prev.filter(item => item.id !== b.id));
            } else {
                // Update
                await API.updateBookmark({
                    bookmarkId: b.id,
                    isFavorite: newStatus.isFavorite,
                    category: newStatus.category
                });
                // Update local state directly
                setBookmarks(prev => prev.map(item => item.id === b.id ? { ...item, category: newStatus.category, isFavorite: newStatus.isFavorite } : item));
            }
        } catch (error) {
            console.error("Failed to update bookmark:", error);
            alert("Failed to save changes. Please try again.");
            // Re-trigger re-render to pass original status back down on failure
            setBookmarks(prev => [...prev]);
        }
    };


    const handleDeleteReview = async (id) => {
        if (window.confirm("Delete this review?")) {
            try {
                await API.deleteReview(id);
                setReviews(prev => prev.filter(r => r.id !== id));
            } catch (error) {
                alert("Failed to delete review");
            }
        }
    };

    const handleEditReview = (r) => {
        setEditingReviewId(r.id);
    };

    const handleUpdateReview = async (id, data) => {
        setIsSubmittingReview(true);
        try {
            await API.updateReview(id, data);
            setReviews(prev => prev.map(r => r.id === id ? { ...r, rating: data.rating, content: data.content } : r));
            setEditingReviewId(null);
        } catch (error) {
            console.error("Failed to update review", error);
            alert("Failed to update review.");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const filteredBookmarks = bookmarks.filter(b => {
        if (activeCategory !== 'all' && b.category !== activeCategory) return false;
        if (showOnlyFavorites && !b.isFavorite) return false;
        return true;
    });

    if (loading) return <div className="loading">Loading Profile...</div>;

    return (
        <div className="profile-page">
            <header className="profile-header">
                <div className="user-info">
                    <h1>{user?.username || 'User Profile'}</h1>
                    <div className="user-details">
                        <span>{user?.email}</span>
                        <span>Joined: {new Date(user?.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="profile-actions">
                    <button className="profile-btn" onClick={() => navigate('/edit-profile')}>Edit Profile</button>
                    <button className="profile-btn" onClick={handleLogout}>Logout</button>
                    <button className="profile-btn danger" onClick={handleDeleteAccount}>Delete Account</button>
                </div>
            </header>

            <div className="main-tabs">
                <button
                    className={`main-tab ${activeTab === 'bookmarks' ? 'active' : ''}`}
                    onClick={() => setActiveTab('bookmarks')}
                >
                    Bookmarks ({bookmarks.length})
                </button>
                <button
                    className={`main-tab ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    Reviews ({reviews.length})
                </button>
            </div>

            <main className="profile-content">
                {activeTab === 'bookmarks' && (
                    <>
                        <div className="content-filters">
                            <div className="category-tabs">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        className={`cat-tab ${activeCategory === cat.id ? 'active' : ''}`}
                                        onClick={() => setActiveCategory(cat.id)}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                            <label className="favorite-filter">
                                <input
                                    type="checkbox"
                                    checked={showOnlyFavorites}
                                    onChange={(e) => setShowOnlyFavorites(e.target.checked)}
                                />
                                Only Favorite
                            </label>
                        </div>

                        {filteredBookmarks.length > 0 ? (
                            <div className="profile-grid">
                                {filteredBookmarks.map(b => (
                                    <BookmarkMovieCard
                                        key={b.id}
                                        movie={{
                                            ...b.movie,
                                            id: b.movie.tmdbId,
                                        }}
                                        onStatusChange={(newStatus) => handleBookmarkStatusChange(b, newStatus)}
                                        category={b.category}
                                        isFavorite={b.isFavorite}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="no-data">No bookmarks found in this category.</div>
                        )}
                    </>
                )}

                {activeTab === 'reviews' && (
                    <div className="stretched-list">
                        {reviews.length > 0 ? (
                            reviews.map(r => (
                                <ReviewMovieCard
                                    key={r.id}
                                    movie={{
                                        ...r.movie,
                                        id: r.movie?.tmdbId,
                                        rating: r.rating
                                    }}
                                    isEditing={editingReviewId === r.id}
                                    onEdit={() => handleEditReview(r)}
                                    onDelete={() => handleDeleteReview(r.id)}
                                >
                                    {editingReviewId === r.id ? (
                                        <div className="inline-review-form-wrapper" style={{ marginTop: '10px' }}>
                                            <ReviewForm
                                                initialData={{ rating: r.rating, content: r.content }}
                                                onSubmit={(data) => handleUpdateReview(r.id, data)}
                                                onCancel={() => setEditingReviewId(null)}
                                                isSubmitting={isSubmittingReview}
                                            />
                                        </div>
                                    ) : (
                                        <p className="rmc-review-text">{r.content}</p>
                                    )}
                                </ReviewMovieCard>
                            ))
                        ) : (
                            <div className="no-data">You haven't written any reviews yet.</div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProfilePage;
