import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import axiosInstance from "../axiosInstance";
const state = atom({
  key: "searches",
  default: [],
});

export default function useSearches() {
  const [searches, setSearches] = useRecoilState(state);
  const fetchSearches = async () => {
    try {
      const res = await axiosInstance.get("/api/search/");
      setSearches(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchSearchById = async (searchId) => {
    try {
      const res = await axiosInstance.get(`/api/search/${searchId}`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };
  const getSearchById = async (searchId) => {
    let search = searches.find((search) => {
      return search.id === searchId
    })
    if (!search) {
      search = await fetchSearchById(searchId);
    }
    return search;
  };
  useEffect(() => {
    if (searches.length === 0) {
      fetchSearches();
    }
  }, []);
  return { searches, fetchSearches, getSearchById };
}