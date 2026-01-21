import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StarRating from './StarRating';

interface Review {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    user: { name: string };
}

interface ReviewSectionProps {
    productId: number;
    reviews: Review[];
    onReviewAdded: () => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId, reviews, onReviewAdded }) => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return showToast('Vui lòng đăng nhập để đánh giá', 'error');
        setSubmitting(true);

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ productId, rating, comment })
            });

            if (res.ok) {
                setComment('');
                onReviewAdded();
                showToast('Cảm ơn bạn đã đánh giá!', 'success');
            } else {
                showToast('Gửi đánh giá thất bại', 'error');
            }
        } catch (error) {
            showToast('Lỗi kết nối', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Đánh giá & Bình luận ({reviews.length})</h2>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Review List */}
                <div className="flex flex-col gap-6">
                    {reviews.length === 0 && <p className="text-gray-500">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>}
                    {reviews.map(review => (
                        <div key={review.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold dark:text-white">{review.user.name}</span>
                                <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                            <StarRating rating={review.rating} size="text-sm" />
                            <p className="mt-2 text-gray-700 dark:text-gray-300">{review.comment}</p>
                        </div>
                    ))}
                </div>

                {/* Submit Form */}
                <div className="bg-white dark:bg-[#1a2632] p-6 rounded-xl border border-gray-100 dark:border-gray-700 h-fit">
                    <h3 className="text-lg font-bold mb-4 dark:text-white">Viết đánh giá của bạn</h3>
                    {user ? (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Đánh giá của bạn</label>
                                <div className="flex gap-1 text-yellow-400 cursor-pointer">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <span key={star} onClick={() => setRating(star)} className="material-symbols-outlined fill-current text-2xl">
                                            {rating >= star ? 'star' : 'star_border'}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Nhận xét</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                    rows={4}
                                    placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                                    className="w-full rounded-md border-gray-300 shadow-sm p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-primary text-white py-2 px-4 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="mb-2 dark:text-gray-300">Bạn cần đăng nhập để đánh giá</p>
                            <a href="/login" className="text-primary font-bold hover:underline">Đăng nhập ngay</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewSection;
