import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Input, message, Select } from "antd";
import axios from "../api/axios";
import {
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  UnlockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const REGISTER_URL = "/bookrental/user";

const USER_REGEX =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const PWD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

const Register: React.FC = () => {
  const navigate = useNavigate();

  const userRef = useRef<any>(null);

  const [userName, setUserName] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [userType, setUserType] = useState("");
  const [validType, setValidType] = useState(false);

  useEffect(() => {
    userRef?.current?.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(userName));
  }, [userName]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setValidType(userType !== "");
  }, [userType]);

  const onUserTypeChange = (value: string) => {
    setUserType(value);
  };

  const onFinish = async (values: any) => {
    console.log(values);

    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({
          userName: values.username,
          password: values.pwd,
          userType: values.userType,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response);
      if (response.data.status === 1) {
        message.success(response.data.message);
      }
      // if (response.data.jwt) {
      //   localStorage.setItem("user", JSON.stringify(response.data));
      //   navigate("../bookrental/category");
      // }
    } catch (err) {
      console.log(err);
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
          <h2 style={{ color: "white" }}>NEW REGISTER</h2>
        </div>
        <Form
          name="basic"
          layout="vertical"
          labelCol={{ span: 18 }}
          // wrapperCol={{  span: 24 }}
          wrapperCol={{ sm: { span: 24 }, xs: { span: 24 } }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label={
              <label style={{ color: "white", fontSize: "18px" }}>
                Username
              </label>
            }
            name="username"
            style={{
              margin: "0.6rem 0",
            }}
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
            style={{ top: "33vh" }}
            className={
              userFocus && userName && !validName ? "instructions" : "offscreen"
            }
          >
            <ExclamationCircleOutlined />
            &nbsp;valid email address with an email prefix and an email domain.
          </p>

          <Form.Item
            label={
              <label style={{ color: "white", fontSize: "18px" }}>
                Password
              </label>
            }
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
            style={{ top: "45.5vh" }}
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

          <Form.Item
            label={
              <label style={{ color: "white", fontSize: "18px" }}>
                Confirm Password
              </label>
            }
            name="matchPwd"
            style={{ marginBottom: "0.6rem" }}
            tooltip={{
              title: !matchPwd
                ? "confirm password empty"
                : validMatch
                ? "password matched"
                : "password unmatched",
              icon: !matchPwd ? (
                <UnlockOutlined style={{ color: "white" }} />
              ) : pwd && validMatch ? (
                <CheckOutlined style={{ color: "green" }} />
              ) : (
                <CloseOutlined style={{ color: "red" }} />
              ),
            }}
          >
            <Input.Password
              onChange={(e) => setMatchPwd(e.target.value)}
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
          </Form.Item>
          <p
            style={{ top: "57.5vh" }}
            className={matchFocus && !validMatch ? "instructions" : "offscreen"}
          >
            <ExclamationCircleOutlined />
            &nbsp;Must match the first password input field.
          </p>

          <Form.Item
            label={
              <label style={{ color: "white", fontSize: "18px" }}>Status</label>
            }
            name="userType"
          >
            <Select
              placeholder="Select a user status"
              style={{ marginBottom: "0.3rem", width: "100%" }}
              onChange={onUserTypeChange}
              options={[
                {
                  value: "ADMIN",
                  label: "Admin",
                },
                {
                  value: "USER",
                  label: "User",
                  disabled: true,
                },
              ]}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }}>
            <Button
              style={{ width: "100%" }}
              type="primary"
              htmlType="submit"
              disabled={
                !validName || !validPwd || !validMatch || !validType
                  ? true
                  : false
              }
            >
              Register
            </Button>
          </Form.Item>
        </Form>
        <p style={{ color: "whitesmoke" }}>
          Already registered? Go to
          <span className="line">
            <Link to="/login">
              <b>&nbsp;Login Page</b>
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
