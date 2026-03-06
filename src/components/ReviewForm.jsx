import { useState, useEffect } from 'react';
import starFilled from '../assets/star-filled.png';

const ReviewForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
    const [rating, setRating] = useState(initialData?.rating || 10);
    const [content, setContent] = useState(initialData?.content || '');

    useEffect(() => {
        if (initialData) {
            setRating(initialData.rating);
            setContent(initialData.content);
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ rating, content });
        if (!initialData) {
            setRating(10);
            setContent('');
        }
    };

    return (
        <div className="review-form-container">
            <form className="review-form" onSubmit={handleSubmit}>
                <h3>{initialData ? 'Edit Your Review' : 'Add a Review'}</h3>

                <div className="rating-input">
                    <label>Rating:</label>
                    <div className="expanding-rating-selector">
                        <div className="stars-wrapper">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <span
                                    key={num}
                                    className={`star-radio ${num <= rating ? 'active' : ''}`}
                                    onClick={() => setRating(num)}
                                    title={`${num}/10`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <span className="rating-number">{rating}/10</span>
                    </div>
                </div>

                <div className="content-input">
                    <textarea
                        placeholder="Share your thoughts about this media..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-btn" disabled={isSubmitting || !content.trim()}>
                        {isSubmitting ? 'Saving...' : (initialData ? 'Update Review' : 'Submit Review')}
                    </button>
                    {onCancel && (
                        <button type="button" className="cancel-btn" onClick={onCancel}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;
