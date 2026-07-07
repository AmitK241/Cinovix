import { useState, useEffect } from 'react';
import { getReviews, getMyReview, submitReview, deleteReview } from '../../services/reviewService';
import StarRating from './StarRating';

function ReviewSection({ tmdbId, mediaType = 'movie' }) {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [hasReviewed, setHasReviewed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const data = await getReviews(tmdbId);
      setReviews(data?.reviews || []);
      setAvgRating(data?.avgRating || 0);
      setTotalReviews(data?.totalReviews || 0);

      const mine = await getMyReview(tmdbId);
      if (mine) {
        setMyRating(mine.rating || 0);
        setMyComment(mine.comment || '');
        setHasReviewed(true);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [tmdbId]);

  const handleSubmit = async () => {
    if (myRating === 0) return;
    setSubmitting(true);
    try {
      await submitReview({
        tmdbId: Number(tmdbId),
        mediaType,
        rating: myRating,
        comment: myComment,
      });
      setHasReviewed(true);
      fetchAll();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete your review?')) return;
    try {
      await deleteReview(tmdbId);
      setMyRating(0);
      setMyComment('');
      setHasReviewed(false);
      fetchAll();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  if (loading) return null;

  return (
    <div className="mt-14">
      <div className="flex items-center gap-4 mb-6">
        <h3 className="font-display text-xl font-semibold text-white">Ratings & Reviews</h3>
        {totalReviews > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={Math.round(avgRating)} interactive={false} size="text-lg" />
            <span className="text-white/70 text-sm">
              {avgRating} ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        )}
      </div>

      {/* Your review form */}
      <div className="bg-surface rounded-xl p-5 mb-6 ring-1 ring-white/5">
        <p className="text-sm text-white/70 mb-3">
          {hasReviewed ? 'Your review' : 'Rate this title'}
        </p>
        <StarRating rating={myRating} onRate={setMyRating} />

        <textarea
          value={myComment}
          onChange={(e) => setMyComment(e.target.value)}
          placeholder="Share your thoughts (optional)"
          maxLength={500}
          rows={3}
          className="w-full mt-3 px-4 py-3 rounded-lg bg-base border border-white/10 text-white placeholder-muted text-sm focus:outline-none focus:border-violet transition resize-none"
        />

        <div className="flex gap-3 mt-3">
          <button
            onClick={handleSubmit}
            disabled={myRating === 0 || submitting}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-violet to-magenta hover:opacity-90 disabled:opacity-40 transition cursor-pointer"
          >
            {submitting ? 'Saving...' : hasReviewed ? 'Update Review' : 'Submit Review'}
          </button>
          {hasReviewed && (
            <button
              onClick={handleDelete}
              className="px-5 py-2 rounded-lg text-sm font-medium text-white/70 border border-white/15 hover:border-magenta hover:text-magenta transition cursor-pointer"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* All reviews list */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="border-b border-white/5 pb-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-white/80 text-sm font-medium">{r.userEmail}</p>
                <StarRating rating={r.rating} interactive={false} size="text-sm" />
              </div>
              {r.comment && <p className="text-white/60 text-sm">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewSection;