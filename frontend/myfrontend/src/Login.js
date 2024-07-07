// src/Login.js

import { Button, Checkbox, Form, Input } from "antd";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function Login() {
  const { loginUser } = useContext(AuthContext);
  const [form] = Form.useForm();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    await loginUser(username, password);
    navigate("/");
  };

  const handlePasswordReset = () => {
    navigate("/password-reset");
  };

  return (
    <div className="space-y-4 mx-auto max-w-xl w-full">
      <h1 className="text-4xl font-medium">Welcome back!</h1>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Username"
          name="username"
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
          <button
            type="button"
            className="text-blue-600"
            onClick={handlePasswordReset}
          >
            Forgot Password?
          </button>
        </p>
        <Form.Item className="pt-3">
          <Button type="primary" htmlType="submit">
            Sign in
          </Button>
          <p className="pt-2">
            Don’t have an account yet?{" "}
            <Link to="/register" className="text-blue-600">
              Create a free account
            </Link>
          </p>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;
