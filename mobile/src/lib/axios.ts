import axios from "axios";

export const URL_HOST_SERVER = "http://192.168.1.121:3333/";

export const api = axios.create({
  baseURL: URL_HOST_SERVER,
});
