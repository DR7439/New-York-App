import { BellOutlined, SettingOutlined } from "@ant-design/icons";
import { Avatar, Badge } from "antd";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useNoti } from "../hooks/useNoti";

let Header = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const { openNotification, notiNumber, notiHolder } = useNoti();

  let username = authState.user.username;

  return (
    <div className="text-white bg-blue-600 h-12 py-2 px-4 flex items-center justify-between">
      <div
        className="text-2xl font-medium cursor-pointer"
        onClick={() => navigate("/")}
      >
        Ad Optima
      </div>
      <div className="flex gap-4 items-center">
        <Link to="/settings">
          <SettingOutlined />
        </Link>
        <Badge
          count={notiNumber}
          size="small"
          className="text-white"
          style={{ backgroundColor: "#ff4d4f" }}
          onClick={openNotification}
        >
          <BellOutlined className="cursor-pointer"/>
        </Badge>
        <div className="flex items-center gap-2">
          <div className="border rounded-full h-fit">
            <Avatar
              src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
              size="small"
            />
          </div>
          <span>{username}</span>
        </div>
      </div>
      {notiHolder}
    </div>
  );
};

export default Header;
