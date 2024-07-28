import { Button, Form, Input, message } from "antd";

import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "./axiosInstance";

const PasswordResetConfirm = () => {
  const { uidb64, token } = useParams();
  const [password, setPassword] = useState("");
  const [sending, setSending] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setSending(true);
      await axiosInstance.post(`/api/users/reset-password/${uidb64}/${token}/`, {
        password,
      });
      message.success("Your password has been reset.");
      navigate("/login");
    } catch (error) {
      message.error("Error resetting password");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 mx-auto max-w-xl w-full">
      <div>
        <h1 className="text-4xl font-medium">Password Reset</h1>
        <p className="text-sm text-neutral-500 mt-2">
          Enter a new password to reset the password on your account.
        </p>
      </div>

      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={sending}
            disabled={sending}
          >
            Reset
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

export default PasswordResetConfirm;
