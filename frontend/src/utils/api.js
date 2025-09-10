import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.12.224:5001/api",
});

export function setAuthToken(token) {
  if (token) API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete API.defaults.headers.common["Authorization"];
}

export default API;
