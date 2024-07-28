import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useFreeSearch } from "../hooks/useFreeSearch";
import Header from "./Header";
import Navbar from "./Navbar";
import SearchModal from "./SearchModal";

let Layout = () => {
  let { pathname } = useLocation();
  const isOnboarding = pathname.includes("onboarding");
  let { loaded } = useFreeSearch();
  if (!loaded) {
    return <></>;
  }
  if (isOnboarding) {
    return <Outlet />;
  }
  return (
    <>
      <SearchModal />
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex">
          <Navbar />
          <div className="h-screen-no-nav overflow-auto w-full">
            <div className="space-y-12 max-w-7xl mx-auto py-10 px-4">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
