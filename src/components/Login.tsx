import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import axios from "../api/axios";
import {
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  UnlockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import authService from "../services/authService";

const LOGIN_URL = "/bookrental/authenticate";

const USER_REGEX =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const PWD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const userRef = useRef<any>(null);

  const [userName, setUserName] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  useEffect(() => {
    userRef?.current?.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(userName));
  }, [userName]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
  }, [pwd]);

  const onFinish = async (values: any) => {
    console.log(values);
    try {
      const response = await axios.post(
        LOGIN_URL,
        {
          username: values.username,
          password: values.pwd,
        }
        // JSON.stringify({
        //   username: values.username,
        //   password: values.pwd,
        // })
      );
      console.log(response);

      if (response.data.jwt) {
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("../bookrental/category");
        // window.location.reload();
      }
    } catch (err: any) {
      message.error(err?.message);
    }
  };

  return (
    <div className="big-box">
      <div className="form-container">
        <div
          style={{
            textAlign: "center",
            borderBottom: "1px solid white",
            width: "100%",
          }}
        >
          <h2 style={{ color: "white" }}>LOGIN</h2>
        </div>
        <Form
          name="basic"
          layout="vertical"
          labelCol={{ span: 18 }}
          // wrapperCol={{  span: 24 }}
          wrapperCol={{ sm: { span: 24 }, xs: { span: 24 } }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            style={{ margin: "0.6rem 0" }}
            tooltip={{
              title: !userName
                ? "username empty"
                : validName
                ? "valid username"
                : "invalid username",

              icon: !userName ? (
                <UserOutlined style={{ color: "white" }} />
              ) : validName ? (
                <CheckOutlined style={{ color: "green" }} />
              ) : (
                <CloseOutlined style={{ color: "red" }} />
              ),
            }}
          >
            <Input
              ref={userRef}
              onChange={(e) => setUserName(e.target.value)}
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
          </Form.Item>
          <p
            style={{ top: "46vh" }}
            className={
              userFocus && userName && !validName ? "instructions" : "offscreen"
            }
          >
            <ExclamationCircleOutlined />
            &nbsp;4 to 24 characters.
            <br />
            Letters, numbers, underscores, hyphens.
          </p>

          <Form.Item
            label="Password"
            name="pwd"
            style={{ marginBottom: "0.6rem" }}
            tooltip={{
              title: !pwd
                ? "password empty"
                : validPwd
                ? "valid password"
                : "invalid password",
              icon: !pwd ? (
                <UnlockOutlined style={{ color: "white" }} />
              ) : validPwd ? (
                <CheckOutlined style={{ color: "green" }} />
              ) : (
                <CloseOutlined style={{ color: "red" }} />
              ),
            }}
          >
            <Input.Password
              onChange={(e) => setPwd(e.target.value)}
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
          </Form.Item>
          <p
            style={{ top: "58.5vh" }}
            className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
          >
            <ExclamationCircleOutlined />
            &nbsp;8 to 24 characters.
            <br />
            Must include uppercase and lowercase letters, a number and a special
            character.
            <br />
            Allowed special characters: ! @ # $ %
          </p>

          <Form.Item wrapperCol={{ span: 24 }}>
            <Button
              style={{ width: "100%" }}
              type="primary"
              htmlType="submit"
              // disabled={!validName || !validPwd ? true : false}
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>
        <p style={{ color: "whitesmoke" }}>
          No account? Go to
          <span className="line">
            <Link to="/">
              <b>&nbsp;Register Page</b>
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
