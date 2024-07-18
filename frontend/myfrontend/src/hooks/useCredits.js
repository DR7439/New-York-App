import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import axiosInstance from "../axiosInstance";
const activeCreditsState = atom({
  key: "activeCredits",
  default: 0,
});
const usedCreditsState = atom({
  key: "usedCredit",
  default: null,
});

export default function useCredits() {
  let [activeCredits, setActiveCredits] = useRecoilState(activeCreditsState);
  let [usedCredits, setUsedCredits] = useRecoilState(usedCreditsState);
  let fetchCreditData = async () => {
    axiosInstance.get("/api/credits").then((res) => {
      setActiveCredits(res.data.credits);
    });
    axiosInstance.get("/api/credits/usage/").then((res) => {
      setUsedCredits({
        today: res.data.credits_used_today,
        thisMonth: res.data.credits_used_last_30_days,
      });
    });
  };
  useEffect(() => {
    if (!usedCredits) {
      fetchCreditData();
    }
  }, []);
  return {
    credits: {
      active: activeCredits,
      usedToday: usedCredits?.today || 0,
      usedThisMonth: usedCredits?.thisMonth || 0,
    },
    fetchCreditData,
  };
}
