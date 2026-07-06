import { useNavigate } from 'react-router-dom';

function TitleCard({ item }) {
  const navigate = useNavigate();

  const imageUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
    : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"%3E%3Crect width="200" height="300" fill="%2316141F"/%3E%3Ctext x="50%25" y="50%25" font-size="14" fill="%238B8B96" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'

  const handleClick = () => {
    navigate(`/watch/${item.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative min-w-[160px] w-[160px] cursor-pointer"
    >
      <div className="relative transition-all duration-300 ease-out group-hover:scale-110 group-hover:z-30 origin-bottom">
        <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-surface shadow-lg group-hover:shadow-2xl group-hover:shadow-violet/40 transition-shadow duration-300 ring-1 ring-white/5 group-hover:ring-2 group-hover:ring-violet">
          <img
            src={imageUrl}
            alt={item.title || item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
            <p className="text-white text-sm font-medium leading-tight line-clamp-2">
              {item.title || item.name}
            </p>
          </div>
        </div>
      </div>
      <p className="mt-2 text-sm text-white/90 truncate h-5">
        {item.title || item.name}
      </p>
    </div>
  );
}

export default TitleCard;