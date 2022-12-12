import axios from "axios";

export default axios.create({
  // baseURL: "https://book-rental-prabin.herokuapp.com",
  // baseURL: "https://book-rental-system-production-0488.up.railway.app/swagger-ui/index.html",
  baseURL:
    "https://book-rental-system-production-0488.up.railway.app/",
});
