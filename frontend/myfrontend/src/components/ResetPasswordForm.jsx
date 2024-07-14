import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import axiosInstance from "../axiosInstance";

const ResetPasswordForm = ({ label }) => {
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
    <Form
      onFinish={handleSubmit}
      layout="vertical"
      style={{
        maxWidth: 600,
      }}
    >
      <Form.Item
        name="email"
        label={label || "Email address"}
        rules={[
          {
            type: "email",
            message: "Please enter a valid email address",
          },
          {
            required: true,
            message: "Please enter your email address",
          },
        ]}
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
        <Button
          type="primary"
          htmlType="submit"
          loading={sending}
          disabled={sending}
        >
          Request
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ResetPasswordForm;
