import axios from "axios";

const axiosClient = axios.create({
  baseURL: `/api`,
  timeout: 20000,
  withCredentials: true,
});

export const config = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
};

export default axiosClient;
