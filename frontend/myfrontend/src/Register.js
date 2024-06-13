// src/Register.js

import { Button, Col, Form, Input, Row } from "antd";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import LeftSide from "./components/LeftSide";
const Register = () => {
  const { registerUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [credits, setCredits] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(username, password, name, credits);
      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <Row className="h-screen">
      <LeftSide />
      <Col span={12} className="flex items-center justify-center">
        <div className="space-y-4 mx-auto max-w-xl w-full">
          <h1 className="text-4xl font-medium">Welcome!</h1>
          <Form onSubmit={handleSubmit} layout="vertical">
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
              rules={[{ required: true }]}
            >
              <Input
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
              <Button type="primary" htmlType="submit">
                Sign up
              </Button>
              <p className="pt-2">
                Already have an account? {" "}
                <Link to="/login" className="text-blue-600">
                  Sign in now
                </Link>
              </p>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default Register;
