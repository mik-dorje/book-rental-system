import { Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const { Title } = Typography;

const Home = () => {
  return (
    <div
      className="home"
      style={{
        background: "black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <Link to="/bookrental/category">
        <Title level={2} style={{ color: "white" }}>
          Login Page
        </Title>
      </Link>
    </div>
  );
};

export default Home;
