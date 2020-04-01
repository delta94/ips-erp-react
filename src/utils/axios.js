import axios from "axios";

var url;

if (process.env.REACT_APP_LOCATION === "ips") {
  url = "http://192.168.2.11:8080/api/v1";
} else if (process.env.REACT_APP_LOCATION === "wg") {
  url = `http://10.81.0.14:8080/api/v1`;
} else {
  url = `http://192.168.0.54:8080/api/v1`;
}

// if (process.env.NODE_ENV !== "production") {
// url = `http://192.168.0.54:8080/api/v1`;
// }

// const loginUrl = "/login";

const Axios = axios.create({
  baseURL: url,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

// interceptor to add token to header
// TODO
// Add else branch to handle no token found
// Axios.interceptors.request.use(config => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `JWT ${token}`;
//   }

//   return config;
// });

// interceptor to handle different HTTP RESPONSE STATUS
Axios.interceptors.response.use(
  response => {
    if (response.status === 204) {
      return response;
    }
    if (!response.data) {
      // console.log(response.data);
      return Promise.reject(response);
    }

    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
  },
  error => {
    console.log(error);
    if (error.response.status === 401) {
      window.location.replace("/login");
    } else if (error.response.status === 400) {
      return Promise.reject(error.response.data);
    }

    if (error.response.status === 403) {
      return Promise.reject(error);
    }

    if (error.response.status === 405) {
      return Promise.reject(error);
    }
    if (error.response.status === 500) {
      return Promise.reject(error.response.data);
    }

    return Promise.reject(error.response.data);
  }
);

export default Axios;
