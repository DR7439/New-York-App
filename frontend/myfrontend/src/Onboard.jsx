import React, { useEffect, useState } from "react";

import { Tour } from "antd";
import { useNavigate } from "react-router-dom";
import SearchForm from "./components/SearchForm";
import { ONBOARD_TOUR_STEPS } from "./constant";

export default function Onboard() {
  let navigate = useNavigate();
  let [open, setOpen] = useState(false); // open the tour
  let visitedTour = localStorage.getItem("visited-onboard-tour");
  // tour across search form
  let tourSteps = ONBOARD_TOUR_STEPS.map((step) => ({
    ...step,
    cover: step.imgSrc && (
      <img alt="tour.png" src={step.imgSrc} />
    ),
    target: () => document.getElementById(step.id),
  }));
  let handleCloseTour = () => {
    setOpen(false);
    localStorage.setItem("visited-onboard-tour", "true");
  };
  useEffect(() => {
    if (!visitedTour) {
      setOpen(true);
    }
  }, []);
  return (
    <div className="p-6">
      <Tour open={open} onClose={handleCloseTour} steps={tourSteps} />
      <div className="text-4xl leading-10 not-italic font-normal font-roboto">
        Welcome to Ad Optima
      </div>
      <div className="font-roboto text-base not-italic font-normal leading-6 text-[#737373]">
        No tutorial is more effective than giving it a try! Start a free search
        for optimizing your target advertising today
      </div>
      <SearchForm onSuccess={() => navigate("/")} />
    </div>
  );
}
