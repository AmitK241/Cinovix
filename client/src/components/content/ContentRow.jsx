import TitleCard from './TitleCard';

function ContentRow({ title, items }) {
  if (!items || items.length === 0) return null;

  return (
    <div style={{ marginBottom: '30px' }}>
      <h3 style={{ marginLeft: '20px', marginBottom: '10px' }}>{title}</h3>
      <div
        style={{
          display: 'flex',
          overflowX: 'auto',
          padding: '0 20px',
          scrollbarWidth: 'thin',
        }}
      >
        {items.map((item) => (
          <TitleCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default ContentRow;