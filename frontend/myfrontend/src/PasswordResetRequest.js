import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import axiosInstance from "./axiosInstance";
import { Link } from "react-router-dom";

const PasswordResetRequest = () => {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    try {
      setSending(true);
      await axiosInstance.post("/api/password-reset/", { email });
      message.success("Password reset link sent to your email");
    } catch (error) {
      message.error("Error sending password reset link");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 mx-auto max-w-xl w-full">
      <div>
        <h1 className="text-4xl font-medium">Forgot Your Password?</h1>
        <p className="text-sm text-neutral-500 mt-2">
          Enter your email address to request the link to reset password.
        </p>
      </div>

      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="email"
          label="Email address"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={sending} disabled={sending}>
            Request
          </Button>
        </Form.Item>
        <p>
          <span>Know your password? </span>
          <Link to="/login" className="text-blue-600">
            Sign in now
          </Link>
        </p>
      </Form>
    </div>
  );
};

export default PasswordResetRequest;
