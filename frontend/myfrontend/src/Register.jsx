// src/Register.js

import { Button, Form, Input, message } from "antd";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
const Register = () => {
  const [form] = Form.useForm();
  const { registerUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name] = useState("");
  const [credits] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const handleSubmit = async () => {
    try {
      setSending(true);
      await registerUser(username, email, password, name, credits);
      navigate("/onboarding");
      message.success("You have successfully registered!");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
        message.error(err.response.data.error);
      } else {
        setError("An error occurred. Please try again.");
        message.error("An error occurred. Please try again.");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4 mx-auto max-w-xl w-full">
      <h1 className="text-4xl font-medium">Welcome!</h1>
      {error && <p className="text-red-500">{error}</p>}
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
          label="Email address"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please enter a valid email address",
            },
          ]}
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
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
        <Form.Item className="pt-3">
          <Button
            type="primary"
            htmlType="submit"
            loading={sending}
            disabled={sending}
          >
            Sign up
          </Button>
        </Form.Item>
        <p className="pt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Sign in now
          </Link>
        </p>
      </Form>
    </div>
  );
};

export default Register;
