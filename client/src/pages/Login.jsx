import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, signupUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loadingBtn, setLoadingBtn] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingBtn(true);

    try {
      const data = isSignup
        ? await signupUser(email, password)
        : await loginUser(email, password);

      login(data);
      navigate('/profiles');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoadingBtn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <img src="/logo.png" alt="Cinovix" className="h-16 mb-1" />
        <p className="text-muted text-sm mb-8">
          {isSignup ? 'Create your account' : 'Welcome back'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-surface border border-white/10 text-white placeholder-muted focus:outline-none focus:border-violet transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-lg bg-surface border border-white/10 text-white placeholder-muted focus:outline-none focus:border-violet transition"
          />

          {error && <p className="text-magenta text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loadingBtn}
            className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-violet to-magenta hover:opacity-90 disabled:opacity-50 transition cursor-pointer"
          >
            {loadingBtn ? 'Please wait...' : isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <p className="text-muted text-sm mt-6 text-center">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-cyan font-medium hover:underline cursor-pointer"
          >
            {isSignup ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;