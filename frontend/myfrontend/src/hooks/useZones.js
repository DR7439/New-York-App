import { atom, useRecoilState } from "recoil";
import axiosInstance from "../axiosInstance";
import { useEffect } from "react";

const zoneState = atom({
  key: "zones",
  default: [],
});

export default function useZones() {
  const [zones, setZones] = useRecoilState(zoneState);
  const fetchZones = async () => {
    try {
      const res = await axiosInstance.get("/api/zones/");
      setZones(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (zones.length === 0) {
      fetchZones();
    }
  }, []);
  return { zones, fetchZones };
}
