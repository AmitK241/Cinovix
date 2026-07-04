import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProviders } from '../../services/contentService';

const REGIONS = [
  { label: 'Bollywood', language: 'hi', emoji: '🎬' },
  { label: 'Hollywood', language: 'en', emoji: '🎥' },
  { label: 'Tollywood', language: 'te', emoji: '🎞️' },
  { label: 'Kollywood', language: 'ta', emoji: '📽️' },
  { label: 'Mollywood', language: 'ml', emoji: '🎦' },
  { label: 'Sandalwood', language: 'kn', emoji: '🍿' },
];

// Exact provider names only (not substrings) to avoid matching add-on channels
// like "Lionsgate Play Amazon Channel" or "Hoichoi Amazon Channel"
const EXACT_PLATFORM_NAMES = [
  'netflix',
  'amazon prime video',
  'jiohotstar',
  'disney+ hotstar',
  'hotstar',
  'zee5',
  'sonyliv',
  'sony liv',
];

function CategoryDropdown() {
  const [open, setOpen] = useState(false);
  const [providers, setProviders] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await getProviders('movie');
        const filtered = data.filter((p) =>
          EXACT_PLATFORM_NAMES.includes(p.provider_name.toLowerCase())
        );
        setProviders(filtered);
      } catch (error) {
        console.error('Error fetching providers:', error);
      }
    };
    fetchProviders();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const goToRegion = (language, label) => {
    setOpen(false);
    navigate(`/category?type=language&value=${language}&label=${encodeURIComponent(label)}`);
  };

  const goToProvider = (providerId, name) => {
    setOpen(false);
    navigate(`/category?type=provider&value=${providerId}&label=${encodeURIComponent(name)}`);
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="text-white/80 hover:text-white text-sm font-medium transition cursor-pointer flex items-center gap-1.5"
      >
        Browse
        <span className={`text-[10px] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '16px',
            zIndex: 50,
            width: '340px',
            maxHeight: '75vh',
          }}
          className="bg-surface border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-y-auto"
        >
          {/* Regional Cinema */}
          <div className="p-5 pb-4">
            <p className="text-[11px] font-semibold text-cyan tracking-[0.15em] mb-3">
              REGIONAL CINEMA
            </p>
            <div className="grid grid-cols-2 gap-2">
              {REGIONS.map((r) => (
                <button
                  key={r.language}
                  onClick={() => goToRegion(r.language, r.label)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-white/80 bg-white/[0.03] hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer text-left"
                >
                  <span className="text-base">{r.emoji}</span>
                  <span className="truncate">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {providers.length > 0 && (
            <>
              <div className="border-t border-white/10" />
              <div className="p-5 pt-4">
                <p className="text-[11px] font-semibold text-cyan tracking-[0.15em] mb-3">
                  STREAMING PLATFORMS
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {providers.map((p) => (
                    <button
                      key={p.provider_id}
                      onClick={() => goToProvider(p.provider_id, p.provider_name)}
                      className="group flex flex-col items-center gap-1.5 cursor-pointer"
                      title={p.provider_name}
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:ring-violet transition-all duration-200 group-hover:scale-105">
                        <img
                          src={`https://image.tmdb.org/t/p/original${p.logo_path}`}
                          alt={p.provider_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[10px] text-white/50 group-hover:text-white/80 transition text-center leading-tight line-clamp-2">
                        {p.provider_name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default CategoryDropdown;