import axios from "axios";
const env = process.env.NODE_ENV == "production";
const baseUrl = $_BaseConfig[process.env.NODE_ENV].baseUrl;
// create an axios instance
const service = axios.create({
  baseURL: baseUrl, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 500000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");

    // do something before request is sent

    return config;
  },
  error => {
    // do something with request error
    // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data;

    return res;
  },
  error => {
    return Promise.reject(error);
  }
);
export default service;
