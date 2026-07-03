import { createContext, useContext, useState, useEffect } from 'react';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [activeProfile, setActiveProfile] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('cinovix_active_profile');
    if (stored) {
      setActiveProfile(JSON.parse(stored));
    }
  }, []);

  const selectProfile = (profile) => {
    localStorage.setItem('cinovix_active_profile', JSON.stringify(profile));
    setActiveProfile(profile);
  };

  const clearProfile = () => {
    localStorage.removeItem('cinovix_active_profile');
    setActiveProfile(null);
  };

  return (
    <ProfileContext.Provider value={{ activeProfile, selectProfile, clearProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);