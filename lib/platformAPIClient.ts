import axios from "axios";

const platformAPIClient = axios.create({
  baseURL: "https://api.minepi.com",
  timeout: 20000,
  headers: { Authorization: `Key ${process.env.PI_API_KEY}` },
});

export default platformAPIClient;
