import React, { useState, useEffect, useRef } from 'react';
import '../styles/BookmarkMenu.css';
import starFilled from '../assets/star-filled.png';
import starEmpty from '../assets/star-empty.png';
import trashIcon from '../assets/bin.png';

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
                <div className="btn-content-wrapper">
                    <span className="current-label">{currentLabel}</span>
                    <div className="status-icons-wrapper">
                        {localStatus.category && (
                            <img
                                src={localStatus.isFavorite ? starFilled : starEmpty}
                                alt="status"
                                className="status-star-icon"
                            />
                        )}
                        {localStatus.category && (
                            <button
                                className="delete-bookmark-btn"
                                onClick={(e) => handleCategoryClick('none', e)}
                                title="Remove Bookmark"
                            >
                                <img src={trashIcon} alt="delete" />
                            </button>
                        )}
                    </div>
                </div>
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
                        <span className="star-icon">
                            <img src={localStatus.isFavorite ? starFilled : starEmpty} alt="favorite" className="star-icon-img" />
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BookmarkMenu;
