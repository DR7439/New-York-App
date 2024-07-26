import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import axiosInstance from "../axiosInstance";
import { useNoti } from "./useNoti";
import { message } from "antd";
const activeCreditsState = atom({
  key: "activeCredits",
  default: null,
});
const usedCreditsState = atom({
  key: "usedCredit",
  default: null,
});

export default function useCredits() {
  let [activeCredits, setActiveCredits] = useRecoilState(activeCreditsState);
  let [usedCredits, setUsedCredits] = useRecoilState(usedCreditsState);
  let { checkNoti } = useNoti();
  let fetchCreditData = async () => {
    axiosInstance.get("/api/users/credits").then((res) => {
      let activeNum = res.data.credits;
      setActiveCredits(activeNum);
      if (activeNum === 0) {
        localStorage.removeItem("credits");
        checkNoti();
      }
    });
    axiosInstance.get("/api/users/credits/usage/").then((res) => {
      setUsedCredits({
        today: res.data.credits_used_today,
        thisMonth: res.data.credits_used_last_30_days,
      });
    });
  };
  let isInsufficientCredits = (newCredits) => {
    return newCredits > activeCredits;
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
    isInsufficientCredits
  };
}
