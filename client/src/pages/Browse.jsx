import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Browse() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <h1>Browse Page</h1>
      <p>Welcome, {user?.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Browse;