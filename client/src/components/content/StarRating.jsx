function StarRating({ rating, onRate, size = 'text-2xl', interactive = true }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex gap-1">
      {stars.map((star) => (
        <span
          key={star}
          onClick={() => interactive && onRate && onRate(star)}
          className={`${size} ${interactive ? 'cursor-pointer' : ''} transition ${
            star <= rating ? 'text-yellow-400' : 'text-white/20'
          } ${interactive ? 'hover:scale-110' : ''}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default StarRating;