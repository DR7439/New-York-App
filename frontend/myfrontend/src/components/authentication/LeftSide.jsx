import { StarFilled } from "@ant-design/icons";
import { Avatar, Col, Typography } from "antd";
import React from "react";

const { Paragraph } = Typography;
function LeftSide() {
  return (
    <div
      className="flex items-center justify-center px-4 md:px-8"
      style={{
        backgroundColor: "#096DD9",
      }}
    >
      <div className="space-y-4 mx-auto max-w-xl text-white">
        <div>
          <h1 className="text-3xl lg:text-4xl font-medium">Welcome to our community</h1>
          <Paragraph className="text-gray-300 pt-4 text-xl lg:text-2xl">
            Ad Optima gives you the best analytics to step up your target
            advertising game.
          </Paragraph>
        </div>
        <div className="pt-10 md:pt-40 space-y-10">
          <div className="space-x-2">
            <StarFilled className="text-yellow-300 text-xl" />
            <StarFilled className="text-yellow-300 text-xl" />
            <StarFilled className="text-yellow-300 text-xl" />
            <StarFilled className="text-yellow-300 text-xl" />
            <StarFilled className="text-yellow-300 text-xl" />
          </div>
          <Paragraph style={{ color: "#fff" }} className="text-lg lg:text-2xl font-medium">
            "We love Ad Optima! Our marketing teams were using it for setting up
            billboards and got crazy results within their first week."
          </Paragraph>
          <div className="flex gap-2">
            <div className="border rounded-full h-fit">
              <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
            </div>
            <div className="grid">
              <div>Devon Lane</div>
              <div className="text-gray-300">Co-Founder, Design.co</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftSide;