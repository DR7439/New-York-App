import axiosInstance from "../axiosInstance";
import { useEffect, useState } from "react";
import { atom, useRecoilState } from "recoil";
const state = atom({
  key: "interests",
  default: [],
});

export default function useInterests() {
  let [interests, setInterests] = useRecoilState(state);
  let fetchInterests = async () => {
    let res = await axiosInstance.get("/api/interests/");
    setInterests(res.data);
  };
  useEffect(() => {
    if (interests.length === 0) {
      fetchInterests();
    }
  }, []);
  return interests;
}
