// src/Login.js

import React, { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Checkbox, Form, Input, Typography } from "antd";
import { Col, Row } from "antd";
import { StarFilled } from "@ant-design/icons";

const { Paragraph } = Typography;

function Login() {
  const { loginUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser(username, password);
    navigate("/dashboard");
  };
  return (
    <>
      <Row className="h-screen">
        <Col
          className="flex items-center justify-center"
          span={12}
          style={{
            backgroundColor: "#096DD9",
          }}
        >
          <div className="space-y-4 mx-auto max-w-xl text-white">
            <div>
              <h1 className="text-3xl font-medium">Welcome to our community</h1>
              <Paragraph className="text-gray-400 pt-4 text-2xl">
                Ad Optima gives you the best analytics to step up your target
                advertising game.
              </Paragraph>
            </div>
            <div className="pt-40 space-y-10">
              <div className="space-x-2">
                <StarFilled className="text-yellow-300 text-xl"/>
                <StarFilled className="text-yellow-300 text-xl"/>
                <StarFilled className="text-yellow-300 text-xl"/>
                <StarFilled className="text-yellow-300 text-xl"/>
                <StarFilled className="text-yellow-300 text-xl"/>
              </div>
              <Paragraph
                style={{ color: "#fff" }}
                className="text-2xl font-medium"
              >
                "We love Ad Optima! Our marketing teams were using it for
                setting up billboards and got crazy results within their first
                week."
              </Paragraph>
              <div className="flex gap-2">
                <div className="border rounded-full h-fit">
                  <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
                </div>
                <div className="grid">
                  <div>Devon Lane</div>
                  <div className="text-gray-400">Co-Founder, Design.co</div>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={12} className="flex items-center justify-center">
          <div className="space-y-4 mx-auto max-w-xl w-full">
            <h1 className="text-3xl font-medium">Welcome back!</h1>
            <Form onSubmit={handleSubmit} layout="vertical">
              <Form.Item
                label="Email address"
                name="email"
                rules={[{ required: true }]}
              >
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true }]}
              >
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </Form.Item>
              <p className="flex gap-2 justify-between pb-4">
                <Checkbox value={remember} onChange={setRemember}>
                  Remember me
                </Checkbox>
                <a href="/" className="text-blue-600">
                  Forgot password?
                </a>
              </p>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Sign in
                </Button>
                <p className="pt-2">
                  Don’t have an account yet?{" "}
                  <a href="/" className="text-blue-600">
                    Create a free account
                  </a>
                </p>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default Login;
