function TitleCard({ item }) {
  const imageUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  return (
    <div style={{ minWidth: '160px', margin: '0 8px', cursor: 'pointer' }}>
      <img
        src={imageUrl}
        alt={item.title || item.name}
        style={{ width: '100%', borderRadius: '4px' }}
      />
      <p style={{ fontSize: '13px', marginTop: '4px' }}>
        {item.title || item.name}
      </p>
    </div>
  );
}

export default TitleCard;