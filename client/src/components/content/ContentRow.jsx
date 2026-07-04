import TitleCard from './TitleCard';

function ContentRow({ title, items, highlight = false }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-10">
      <h3 className={`font-display text-lg font-semibold mb-4 px-6 md:px-12 ${highlight ? 'text-aurora' : 'text-white'}`}>
        {highlight && '✨ '}{title}
      </h3>
      <div className="scroll-row flex gap-4 overflow-x-auto overflow-y-visible px-6 md:px-12 pt-6 pb-10">
        {items.map((item) => (
          <TitleCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default ContentRow;