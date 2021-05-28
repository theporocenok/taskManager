import {useState, useEffect} from 'react'
import {useRequest} from "../axios.hook";

export const useSubordinates = () => {
  const [ subordinates, setSubordinates ] = useState([]);
  const { request } = useRequest();

  useEffect(() => {
    async function getSubordinates() {
      try {
        const data = await request('/users', 'GET');
        setSubordinates(data.subordinates);
      } catch (e) {}
    }
    getSubordinates();
  }, [request]);

  return subordinates;
}