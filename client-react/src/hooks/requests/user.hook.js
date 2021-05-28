import {useState, useEffect} from 'react'
import {useRequest} from "../axios.hook";

export const useUser = () => {
  const [user, setUser] = useState({});
  const { request } = useRequest();

  useEffect(() => {
    async function getUserInfo() {
      try {
        const data = await request('/auth/me', 'GET');
        setUser(data);
      } catch (e) {}
    }
    getUserInfo();
  }, [request]);

  return user;

}