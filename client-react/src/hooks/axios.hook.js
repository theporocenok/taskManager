import {useState, useCallback, useContext} from 'react';
import axios from "axios";
import {AuthContext} from "../contextes/AuthContext";

export const useRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {token, logout} = useContext(AuthContext);

  const request = useCallback(async (url, method = 'GET', data = undefined) => {
    setLoading(true);
    try {
      if (method === 'GET' && data) {
        url += '?' + new URLSearchParams(data).toString();
      }
      return await axios({
        method,
        url: process.env.REACT_APP_REQUEST_HOST + url,
        data,
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'authorization': token,
        },
      })
        .then(response => {
          setLoading(false);
          return response.data;
        });
    } catch(e) {
      setLoading(false);
      setError(e.response?.data?.message ?? e.message);
      if (e.response.status === 401) {
        logout();
      }
    }
  }, [token, logout]);

  const clearError = () => setError(null);

  return {loading, request, error, clearError}
}