import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfiles, createProfile, deleteProfile } from '../services/profileService';
import { useProfile } from '../context/ProfileContext';

const AVATAR_SEEDS = [
  'felix', 'aneka', 'milo', 'zoe', 'max', 'luna',
  'rocky', 'nova', 'oscar', 'ruby', 'leo', 'mia',
  'jack', 'chloe', 'finn', 'ivy',
];

function ProfileSelect() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedSeed, setSelectedSeed] = useState(AVATAR_SEEDS[0]);

  const { selectProfile } = useProfile();
  const navigate = useNavigate();

  const fetchProfiles = async () => {
    try {
      const data = await getProfiles();
      setProfiles(data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleSelect = (profile) => {
    selectProfile(profile);
    navigate('/browse');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      await createProfile({
        name: newName,
        avatar: `https://api.dicebear.com/7.x/thumbs/svg?seed=${selectedSeed}`,
        isKid: false,
      });
      setNewName('');
      setShowForm(false);
      fetchProfiles();
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this profile?')) return;

    try {
      await deleteProfile(id);
      fetchProfiles();
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-aurora font-display text-xl font-semibold animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <img
        src="/logo.png"
        alt="Cinovix"
        onClick={() => navigate('/browse')}
        className="h-9 cursor-pointer"
      />
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-12">
        Who's watching?
      </h2>

      <div className="flex flex-wrap gap-6 justify-center max-w-3xl mb-4">
        {profiles.map((profile) => (
          <div
            key={profile._id}
            onClick={() => handleSelect(profile)}
            className="group relative cursor-pointer flex flex-col items-center"
          >
            <div className="relative w-28 h-28 rounded-xl overflow-hidden ring-2 ring-white/10 group-hover:ring-violet transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-violet/40 group-hover:-translate-y-1 bg-surface">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <p className="mt-3 text-white/80 group-hover:text-white text-sm font-medium transition">
              {profile.name}
            </p>

            <button
              onClick={(e) => handleDelete(profile._id, e)}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-surface ring-1 ring-white/20 text-white/70 hover:text-magenta hover:ring-magenta text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        ))}

        {profiles.length < 5 && (
          <div
            onClick={() => setShowForm(true)}
            className="group cursor-pointer flex flex-col items-center"
          >
            <div className="w-28 h-28 rounded-xl border-2 border-dashed border-white/15 flex items-center justify-center text-white/40 text-4xl font-light group-hover:border-violet group-hover:text-violet transition-all duration-300">
              +
            </div>
            <p className="mt-3 text-white/50 text-sm font-medium group-hover:text-white/80 transition">
              Add Profile
            </p>
          </div>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="aurora-border glass-card rounded-2xl p-6 mt-8 w-full max-w-sm"
        >
          <h3 className="font-display text-lg font-semibold text-white mb-4">New Profile</h3>

          <input
            type="text"
            placeholder="Profile name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-surface border border-white/10 text-white placeholder-muted focus:outline-none focus:border-violet transition mb-4"
          />

          <p className="text-muted text-xs mb-2">Choose an avatar</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {AVATAR_SEEDS.map((seed) => (
              <img
                key={seed}
                src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}`}
                alt={seed}
                onClick={() => setSelectedSeed(seed)}
                className={`w-11 h-11 rounded-lg cursor-pointer bg-surface transition ${
                  selectedSeed === seed
                    ? 'ring-2 ring-violet scale-105'
                    : 'ring-1 ring-white/10 hover:ring-white/30'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-violet to-magenta hover:opacity-90 transition cursor-pointer"
            >
              Create Profile
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-white/70 border border-white/15 hover:border-white/30 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ProfileSelect;