import React, { useState, useEffect, useRef } from 'react';
import '../styles/BookmarkMenu.css';

const BookmarkMenu = ({ bookmarkStatus, isLoggedIn, onSave }) => {
    const [localStatus, setLocalStatus] = useState({
        category: bookmarkStatus?.category || null,
        isFavorite: !!bookmarkStatus?.isFavorite
    });

    // Track if any changes were made while open
    const hasChanged = useRef(false);

    // Sync local state when bookmarkStatus prop updates from parent
    useEffect(() => {
        setLocalStatus({
            category: bookmarkStatus?.category || null,
            isFavorite: !!bookmarkStatus?.isFavorite
        });
        hasChanged.current = false;
    }, [bookmarkStatus]);

    const categoryLabels = {
        'wishlist': 'Want to Watch',
        'watching': 'Watching',
        'watched': 'Watched',
        'dropped': 'Dropped'
    };

    const handleCategoryClick = (category, e) => {
        if (e) e.stopPropagation();
        if (!isLoggedIn) {
            alert("Please log in to manage your bookmarks and favorites.");
            return;
        }

        setLocalStatus(prev => ({ ...prev, category: category === 'none' ? null : category }));
        hasChanged.current = true;
    };

    const handleFavoriteClick = (e) => {
        if (e) e.stopPropagation();
        if (!isLoggedIn) {
            alert("Please log in to manage your favorites.");
            return;
        }

        setLocalStatus(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
        hasChanged.current = true;
    };

    const handleMouseLeave = () => {
        if (hasChanged.current && onSave) {
            onSave(localStatus);
            hasChanged.current = false; // Reset after saving
        }
    };

    const currentLabel = localStatus.category && categoryLabels[localStatus.category]
        ? categoryLabels[localStatus.category]
        : 'Add to List ▼';

    return (
        <div className="bookmark-menu-container" onMouseLeave={handleMouseLeave}>
            <div className="bookmark-main-btn">
                <span className="current-category">
                    {currentLabel}
                </span>
            </div>

            <div className="bookmark-dropdown">
                <div className="bookmark-dropdown-inner">
                    {Object.entries(categoryLabels).map(([key, label]) => (
                        <div
                            key={key}
                            className={`dropdown-item ${localStatus.category === key ? 'selected' : ''}`}
                            onClick={(e) => handleCategoryClick(key, e)}
                        >
                            {label}
                        </div>
                    ))}

                    <div
                        className={`dropdown-item favorite-item ${localStatus.isFavorite ? 'active' : ''}`}
                        onClick={handleFavoriteClick}
                        title={localStatus.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                    >
                        <span>Favorites</span>
                        <span className="star-icon">{localStatus.isFavorite ? '★' : '☆'}</span>
                    </div>

                    {localStatus.category && (
                        <div
                            className="dropdown-item clear-btn"
                            onClick={(e) => handleCategoryClick('none', e)}
                            title="Remove from Lists"
                        >
                            Remove
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookmarkMenu;
