import axios from 'axios';

interface AuthResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  scope?: string;
}

export const authenticate = async (username: string, password: string): Promise<string> => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  params.append('grant_type', 'password');

  const response = await axios.post<AuthResponse>(
    `${import.meta.env.VITE_API_BASE_URL}/oauth/token`,
    params,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  if (!response.data?.access_token) {
    throw new Error('Authentication failed');
  }

  return response.data.access_token;
};
