import axios from "axios";

const BASE_URL =
  import.meta.env.NODE_ENV === "development"
    ? "http://localhost:5001/api"
    : "/api";
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});
export default axiosInstance;
