import {
  DashboardOutlined,
  SettingOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import clsx from "clsx";
import React from "react";
import { NavLink } from "react-router-dom";

function NavItem({ children, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-2 py-5 px-6",
          isActive ? "bg-blue-100 text-blue-600 border-r-2 border-blue-600" : ""
        )
      }
    >
      {children}
    </NavLink>
  );
}

let Navbar = () => {
  return (
    <ul className="w-72 border-r space-y-2 py-2">
      <NavItem to="/">
        <DashboardOutlined />
        <span>Dashboard</span>
      </NavItem>
      <NavItem to="/credits">
        <ShoppingOutlined />
        <span>Credits</span>
      </NavItem>
      <NavItem to="/settings">
        <SettingOutlined />
        <span>Settings</span>
      </NavItem>
    </ul>
  );
};

export default Navbar;
