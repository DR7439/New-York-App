import React from "react";

import SearchForm from "./components/SearchForm";
import { useNavigate } from "react-router-dom";

export default function Onboard() {
  let navigate = useNavigate();
  return (
    <div className="p-6">
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
