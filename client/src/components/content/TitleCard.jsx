import { useNavigate } from 'react-router-dom';

function TitleCard({ item }) {
  const navigate = useNavigate();

  const imageUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  const handleClick = () => {
    navigate(`/watch/${item.id}`);
  };

  return (
    <div
      onClick={handleClick}
      style={{ minWidth: '160px', margin: '0 8px', cursor: 'pointer' }}
    >
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