import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestReset = async () => {
    setError(null);
    try {
      await apiClient.post('api/Accounts/ForgetPassword', null, { params: { email } });
      setHasSubmitted(true);
    } catch (err) {
      console.error('Unable to request password reset', err);
      setError('Oops! Something went wrong while processing your request. Please try again shortly.');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    await requestReset();
    setIsSubmitting(false);
  };

  const handleResend = async () => {
    setIsSubmitting(true);
    await requestReset();
    setIsSubmitting(false);
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Password help</p>
          <h1>Forgot password</h1>
          <p>
            No worries — it happens to the best of us. Enter your email below and we'll send you a link to
            reset it.
          </p>
        </div>
      </div>

      <div className="callout">
        <p className="muted">
          Tip: make sure you're using the email address provided by your administrator when signing in.
        </p>
      </div>

      {hasSubmitted ? (
        <div className="status success">
          <h2>Reset link sent</h2>
          <p>
            Please check your inbox and follow the instructions to reset your password. Didn't receive the
            email?
          </p>
          <div className="form-actions">
            <button type="button" onClick={handleResend} disabled={isSubmitting}>
              {isSubmitting ? 'Resending…' : 'Resend link'}
            </button>
            <Link to="/login" className="secondary">
              Back to login
            </Link>
          </div>
        </div>
      ) : (
        <form className="form" onSubmit={handleSubmit}>
          <label className="form-field" htmlFor="email">
            <span>Email</span>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <div className="form-actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending reset link…' : 'Send reset link'}
            </button>
            <Link to="/login" className="secondary">
              Back to login
            </Link>
          </div>
        </form>
      )}
    </section>
  );
};
