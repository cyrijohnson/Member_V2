import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.svg';

interface HeaderProps {
  isAuthenticated: boolean;
  onSignOut: () => void;
}

const navLinks = [
  { to: '/', label: 'My Profile', requiresAuth: true },
  { to: '/forgot-password', label: 'Forgot password', requiresAuth: false }
];

export const Header = ({ isAuthenticated, onSignOut }: HeaderProps) => {
  const location = useLocation();

  return (
    <header className="app-header">
      <div className="brand">
        <img src={logo} alt="CoP UK logo" className="brand-mark" />
        <div className="brand-text">
          <span className="brand-accent">CoP UK</span>
          <span>Membership</span>
        </div>
      </div>
      <nav>
        <ul>
          {navLinks
            .filter((link) => (link.requiresAuth ? isAuthenticated : true))
            .map((link) => (
              <li key={link.to} className={location.pathname === link.to ? 'active' : ''}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
        </ul>
      </nav>
      <div className="header-actions">
        {isAuthenticated ? (
          <button type="button" className="secondary" onClick={onSignOut}>
            Sign out
          </button>
        ) : (
          <Link to="/login" className="secondary">
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
};
