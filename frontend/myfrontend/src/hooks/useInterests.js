import axiosInstance from "../axiosInstance";
import { useEffect, useState } from "react";

export default function useInterests() {
  let [interests, setInterests] = useState([]);
  let fetchInterests = async () => {
    let res = await axiosInstance.get("/api/interests/");
    setInterests(res.data);
  };
  useEffect(() => {
    fetchInterests();
  }, []);
  return interests;
}
