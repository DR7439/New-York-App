import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import axiosInstance from "../axiosInstance";
const state = atom({
  key: "searches",
  default: [],
})

export default function useSearches() {
  const [searches, setSearches] = useRecoilState(state);
  const fetchSearches = async () => {
    console.log('9779 fetchSearches')
    try {
      const res = await axiosInstance.get("/api/search/");  
      setSearches(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (searches.length === 0) {
      fetchSearches();
    }
  }, []);
  return {searches, fetchSearches};
}
