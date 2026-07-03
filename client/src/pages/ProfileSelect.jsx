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
    return <div style={{ padding: '20px', color: 'white', backgroundColor: '#141414', minHeight: '100vh' }}>Loading...</div>;
  }

  return (
    <div
      style={{
        backgroundColor: '#141414',
        color: 'white',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h1 style={{ marginBottom: '30px' }}>Who's watching?</h1>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '700px' }}>
        {profiles.map((profile) => (
          <div
            key={profile._id}
            onClick={() => handleSelect(profile)}
            style={{ textAlign: 'center', cursor: 'pointer', position: 'relative' }}
          >
            <img
              src={profile.avatar}
              alt={profile.name}
              style={{ width: '100px', height: '100px', borderRadius: '8px', backgroundColor: '#333' }}
            />
            <p style={{ marginTop: '8px' }}>{profile.name}</p>
            <button
              onClick={(e) => handleDelete(profile._id, e)}
              style={{ position: 'absolute', top: '-8px', right: '-8px', borderRadius: '50%', width: '24px', height: '24px' }}
            >
              ×
            </button>
          </div>
        ))}

        {profiles.length < 5 && (
          <div
            onClick={() => setShowForm(true)}
            style={{
              width: '100px',
              height: '100px',
              border: '2px dashed #555',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              borderRadius: '8px',
              fontSize: '30px',
            }}
          >
            +
          </div>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{ marginTop: '30px', textAlign: 'center' }}>
          <input
            type="text"
            placeholder="Profile name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{ padding: '10px', marginBottom: '10px', display: 'block' }}
            required
          />

          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '400px' }}>
            {AVATAR_SEEDS.map((seed) => (
              <img
                key={seed}
                src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}`}
                alt={seed}
                onClick={() => setSelectedSeed(seed)}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: selectedSeed === seed ? '3px solid white' : '3px solid transparent',
                }}
              />
            ))}
          </div>

          <button type="submit" style={{ padding: '10px 20px' }}>Create Profile</button>
          <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', marginLeft: '10px' }}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default ProfileSelect;