import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";

let Layout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex">
        <Navbar />
        <div className="space-y-12 max-w-6xl mx-auto py-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
