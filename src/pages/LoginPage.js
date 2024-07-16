import { Button, Col, Form, Input, Row } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../utility/Rest";

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();

  const [loginCredentials, setLoginCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginCredentials({
      ...loginCredentials,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await login(
        loginCredentials.username,
        loginCredentials.password
      );
      localStorage.setItem("token", response);
      if (onLoginSuccess) {
        onLoginSuccess();

        navigate("/table");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <Form onFinish={handleSubmit}>
      <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
        <Col span={8}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              type="text"
              name="username"
              value={loginCredentials.username}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              type="password"
              name="password"
              value={loginCredentials.password}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default Login;
