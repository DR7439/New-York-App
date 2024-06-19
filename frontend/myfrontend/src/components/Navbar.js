import {
  DashboardOutlined,
  SettingOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import clsx from "clsx";
import React from "react";
import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", icon: <DashboardOutlined />, title: "Dashboard" },
  { to: "/credits", icon: <ShoppingOutlined />, title: "Credits" },
  { to: "/settings", icon: <SettingOutlined />, title: "Settings" },
];

function NavItem({ item }) {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-2 py-5 px-6",
          isActive ? "bg-blue-100 text-blue-600 border-r-2 border-blue-600" : ""
        )
      }
    >
      {item.icon}
      <span>{item.title}</span>
    </NavLink>
  );
}

let Navbar = () => {
  return (
    <ul className="w-72 border-r space-y-2 py-2">
      {NAV_ITEMS.map((item) => (
        <NavItem key={item.to} item={item} />
      ))}
    </ul>
  );
};

export default Navbar;
