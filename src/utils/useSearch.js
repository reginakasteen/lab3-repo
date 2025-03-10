import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxios, {baseURL} from '../utils/useAxios'


const useSearch = (initialQuery = "") => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const axios = useAxios();


  const searchUser = async (username) => {
    if (!username) return;
    
    setLoading(true);
    try {
      const res = await axios.get(baseURL + '/search/' + username + '/');

      setResults(res.data);
      navigate(`/search/${username}/`); 
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      searchUser(initialQuery);
    }
  }, [initialQuery]);

  return { searchUser, results, loading };
};

export default useSearch;
