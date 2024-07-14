import {
  DashboardOutlined,
  LogoutOutlined,
  SettingOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import clsx from "clsx";
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../AuthContext";

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
          "flex items-center gap-2 py-5 px-6 hover:bg-gray-100",
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
  const { logoutUser } = useContext(AuthContext);

  return (
    <ul className="w-72 border-r py-2 flex flex-col gap-2 h-screen-no-nav">
      {NAV_ITEMS.map((item) => (
        <NavItem key={item.to} item={item} />
      ))}
      <div onClick={logoutUser} className="flex items-center gap-2 py-5 px-6 !mt-auto" role="button">
        <LogoutOutlined />
        <span>Logout</span>
      </div>
    </ul>
  );
};

export default Navbar;
