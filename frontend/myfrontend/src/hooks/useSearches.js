import axios from "axios";
import { useEffect, useState } from "react";

export default function useSearches() {
  const [searches, setSearches] = useState([]);
  const fetchSearches = async () => {
    try {
      const res = await axios.get("/api/search");
      setSearches(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchSearches();
  }, []);
  return searches;
}
