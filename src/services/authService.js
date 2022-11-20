import axios from "../api/axios";

const REGISTER_URL = "bookrent/user";
const LOGIN_URL = "/authenticate";

const signup = (userName, pwd, userType) => {
  return axios
    .post(REGISTER_URL, {
      userName: userName,
      password: pwd,
      userType: userType,
    })
    .then((response) => {
      if (response.data.jwt) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
    });
};

const login = (userName, pwd) => {
  return axios
    .post(LOGIN_URL, {
      username: userName,
      password: pwd,
    })
    .then((response) => {
      console.log(response);
      if (response.data.jwt) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  signup,
  login,
  logout,
};

export default authService;
