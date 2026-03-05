import { useState } from 'react';
import starFilled from '../assets/star-filled.png';
import ReviewForm from './ReviewForm';

const ReviewItem = ({ review, isOwnReview, onUpdate, onDelete, isSubmitting }) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleUpdate = async (data) => {
        await onUpdate(review.id, data);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <ReviewForm
                initialData={{ rating: review.rating, content: review.content }}
                onSubmit={handleUpdate}
                onCancel={() => setIsEditing(false)}
                isSubmitting={isSubmitting}
            />
        );
    }

    return (
        <div className="review-card">
            <div className="review-header">
                <div className="user-info">
                    <span className="username">
                        {isOwnReview ? 'You' : (review.username || `User #${review.userId}`)}
                    </span>
                </div>
                <div className="rating">
                    <img src={starFilled} alt="star" className="star-icon-img" />
                    {review.rating}/10
                </div>
            </div>

            <p>{review.content}</p>

            {isOwnReview && (
                <div className="review-actions">
                    <button
                        className="action-btn"
                        onClick={() => setIsEditing(true)}
                        disabled={isSubmitting}
                    >
                        Edit
                    </button>
                    <button
                        className="action-btn delete"
                        onClick={() => onDelete(review.id)}
                        disabled={isSubmitting}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewItem;
