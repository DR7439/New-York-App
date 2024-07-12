import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
import SearchModal from "./SearchModal";

let Layout = () => {
  return (
    <>
      <SearchModal />
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex gap-4">
          <Navbar />
          <div className="h-screen-no-nav overflow-auto w-full">
            <div className="space-y-12 max-w-6xl mx-auto py-10 ">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
