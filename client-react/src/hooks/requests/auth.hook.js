import {useState, useCallback, useEffect} from 'react';

const storageTokenName = 'jwt';

export const useAuth = () => {
  const [token, setToken] = useState(null);

  const login = useCallback((jwtToken) => {
    setToken(jwtToken);
    localStorage.setItem(storageTokenName, jwtToken);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem(storageTokenName);
  }, []);

  useEffect(() => {
    if (localStorage.getItem(storageTokenName)) {
      login(localStorage.getItem(storageTokenName));
    }
  }, [login]);

  return { login, logout, token };
}