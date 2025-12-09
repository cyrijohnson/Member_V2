import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { getMyDetails } from './api/member';
import { MemberDetail } from './types/member';
import { Header } from './components/Header';
import { SignIn } from './components/SignIn';
import { ForgotPassword } from './components/ForgotPassword';
import { Profile } from './components/Profile';

const useAuthToken = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));

  const updateToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem('authToken', newToken);
    } else {
      localStorage.removeItem('authToken');
    }
    setToken(newToken);
  };

  return { token, setToken: updateToken };
};

const AuthenticatedRoute = ({ token, children }: { token: string | null; children: JSX.Element }) => {
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

const App = () => {
  const navigate = useNavigate();
  const { token, setToken } = useAuthToken();
  const [memberDetails, setMemberDetails] = useState<MemberDetail | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const canRequestProfile = useMemo(() => Boolean(token), [token]);

  const loadProfile = useCallback(async () => {
    if (!canRequestProfile) {
      setMemberDetails(null);
      return;
    }

    try {
      setLoadingProfile(true);
      setProfileError(null);
      const details = await getMyDetails();
      setMemberDetails(details);
    } catch (error) {
      console.error('Unable to load profile', error);
      setProfileError('Unable to load profile details. Please sign in again.');
    } finally {
      setLoadingProfile(false);
    }
  }, [canRequestProfile]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const handleSignOut = () => {
    setToken(null);
    setMemberDetails(null);
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <Header isAuthenticated={Boolean(token)} onSignOut={handleSignOut} />
      <main className="page">
        <Routes>
          <Route
            path="/"
            element={
              <AuthenticatedRoute token={token}>
                <Profile
                  member={memberDetails}
                  isLoading={loadingProfile}
                  errorMessage={profileError}
                  onRetry={loadProfile}
                />
              </AuthenticatedRoute>
            }
          />
          <Route path="/login" element={<SignIn onAuthenticated={(authToken) => setToken(authToken)} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to={token ? '/' : '/login'} replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
