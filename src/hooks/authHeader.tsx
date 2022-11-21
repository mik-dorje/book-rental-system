export default function authHeader() {
  const localUser = localStorage.getItem("user");
  if (localUser) {
    const user = JSON.parse(localUser);
    if (user && user.jwt) {
      return {
        Authorization: "Bearer " + user.jwt,
        "Content-Type": "application/json"
      };
    } else {
      return {};
    }
  }
}
