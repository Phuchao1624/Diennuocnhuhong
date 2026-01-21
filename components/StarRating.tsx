import React from 'react';

interface StarRatingProps {
    rating: number;
    size?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, size = "text-base" }) => {
    return (
        <div className={`flex items-center text-yellow-400 ${size}`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="material-symbols-outlined fill-current">
                    {rating >= star ? 'star' : rating >= star - 0.5 ? 'star_half' : 'star_border'}
                </span>
            ))}
        </div>
    );
};

export default StarRating;
