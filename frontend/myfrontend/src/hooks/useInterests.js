import axiosInstance from "../axiosInstance";
import { useEffect, useState } from "react";
import { atom, useRecoilState } from "recoil";
import fetchWithCache from "../utils/fetchWithCache";
const state = atom({
  key: "interests",
  default: [],
});

export default function useInterests() {
  let [interests, setInterests] = useRecoilState(state);
  let fetchInterests = async () => {
    let data = await fetchWithCache("/api/interests/");
    // let res = await axiosInstance.get("/api/interests/");
    setInterests(data);
  };
  useEffect(() => {
    if (interests.length === 0) {
      fetchInterests();
    }
  }, []);
  return interests;
}
