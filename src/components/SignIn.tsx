import { FormEvent, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { authenticate } from '../api/auth';

interface SignInProps {
  onAuthenticated: (token: string) => void;
}

export const SignIn = ({ onAuthenticated }: SignInProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const token = await authenticate(username, password);
      onAuthenticated(token);
      navigate((location.state as { from?: Location })?.from?.pathname || '/');
    } catch (err) {
      setError('Incorrect username or password. Please try again.');
      console.error('Authentication error', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Sign in</p>
          <h1>Access your profile</h1>
          <p>Use your membership credentials to view your personal details.</p>
        </div>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Username</span>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label className="form-field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="form-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
          <Link to="/forgot-password" className="secondary">
            Forgot password?
          </Link>
        </div>
      </form>
    </section>
  );
};
