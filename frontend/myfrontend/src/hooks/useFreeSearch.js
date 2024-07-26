import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import { atom, useRecoilState } from "recoil";

const FreeStateAtom = atom({
  key: "freeState",
  default: {
    freeSearch: false,
    loaded: false,
  },
})
export function useFreeSearch() {
  let { pathname } = useLocation();
  let [ freeState, setFreeState] = useRecoilState(FreeStateAtom);  
  let { freeSearch, loaded } = freeState;
  let setLoaded = v => setFreeState(prev => ({...prev, loaded: v}))
  let setFreeSearch = v => setFreeState(prev => ({...prev, freeSearch: v}))
  let navigate = useNavigate();

  const isOnboarding = pathname.includes("onboarding");
  function onFirstSearchCreated() {
    setFreeSearch(false);
  }
  function checkOnbardingRoute(isFreeSearch) {
    if (isFreeSearch || freeSearch) {

      if (!isOnboarding) {
        navigate("/onboarding");
      }
    } else {
      if (isOnboarding) {
        navigate("/");
      }
    }
  }
  useEffect(() => {
    if (loaded) {
      return;
    }
    axiosInstance.get("/api/users/free-search").then((res) => {
      let free_search = res.data.free_search;
      checkOnbardingRoute(free_search);
      setFreeSearch(free_search);
      setLoaded(true);
    });
  }, []);
  useEffect(() => {
    if (loaded) {
      checkOnbardingRoute();
    }
  }, [loaded, freeSearch, isOnboarding, navigate]);
  return { freeSearch, loaded, onFirstSearchCreated };
}
