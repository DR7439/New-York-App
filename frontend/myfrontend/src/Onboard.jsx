import React, { useEffect, useState } from "react";

import { Tour } from "antd";
import { useNavigate } from "react-router-dom";
import SearchForm from "./components/SearchForm";
import { ONBOARD_TOUR_STEPS, TOUR_STORAGE_KEY } from "./constant";
import { Logo } from "./components/Logo";
import { useFreeSearch } from "./hooks/useFreeSearch";
export default function Onboard() {
  let navigate = useNavigate();
  let { onFirstSearchCreated } = useFreeSearch()
  let [open, setOpen] = useState(false); // open the tour
  let visitedTour = localStorage.getItem(TOUR_STORAGE_KEY.onboard);
  // tour across search form
  let tourSteps = ONBOARD_TOUR_STEPS.map((step) => ({
    ...step,
    cover: step.imgSrc && <img alt="tour.png" src={step.imgSrc} />,
    target: () => document.getElementById(step.id),
  }));
  let handleCloseTour = () => {
    setOpen(false);
    localStorage.setItem(TOUR_STORAGE_KEY.onboard, true);
  };
  useEffect(() => {
    if (!visitedTour) {
      setOpen(true);
    }
  }, []);
  return (
    <>
      <div className="text-white bg-blue-600 h-12 py-2 px-4 flex items-center justify-between">
        <Logo />
      </div>
      <div className="p-6 max-w-[600px] mx-auto space-y-3">
        <Tour open={open} onClose={handleCloseTour} steps={tourSteps} />
        <div className="text-4xl leading-10 not-italic font-normal font-roboto">
          Welcome to Ad Optima
        </div>
        <div className="font-roboto text-base not-italic font-normal leading-6 text-[#737373]">
          No tutorial is more effective than giving it a try! Start a free
          search for optimizing your target advertising today
        </div>
        <SearchForm onSuccess={onFirstSearchCreated} isFreeSearch />
      </div>
    </>
  );
}
