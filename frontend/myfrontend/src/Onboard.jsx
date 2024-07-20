import React, { useEffect, useState } from "react";

import { Tour } from "antd";
import { useNavigate } from "react-router-dom";
import SearchForm from "./components/SearchForm";

export default function Onboard() {
  let navigate = useNavigate();
  let [open, setOpen] = useState(false); // open the tour
  let visitedTour = localStorage.getItem("visited-onboard-tour");
  // tour across search form
  let tourSteps = [
    {
      title: "Welcome to Ad Optima",
      description: "Welcome to Ad Optima description",
      cover: (
        <img
          alt="tour.png"
          src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
        />
      ),
    },
    {
      title: "Search Name",
      description: "Search Name description",
      placement: "top",
      target: () => document.getElementById("field-name"),
    },
    {
      title: "Target Market Interest",
      description: "Target Market Interest description",
      placement: "top",
      target: () => document.getElementById("field-target-markets"),
    },
    {
      title: "Target Gender",
      description: "Target Gender description",
      placement: "top",
      target: () => document.getElementById("field-target-gender"),
    },
    {
      title: "Target Age",
      description: "Target Age description",
      placement: "top",
      target: () => document.getElementById("field-target-ages"),
    },
    {
      title: "Target Date",
      description: "Target Date description",
      placement: "top",
      target: () => document.getElementById("field-date-range"),
    },
    {
      title: "Start my free search",
      description: "Start my free search description",
      placement: "top",
      target: () => document.getElementById("submit-button"),
    },

    // {
    //   title: "Other Actions",
    //   description: "Click to see other actions.",
  ];
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
