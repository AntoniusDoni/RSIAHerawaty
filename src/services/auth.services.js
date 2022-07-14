import axios from "axios";


const API_URL = "http://localhost:3000/api/auth/";

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "signin", { username, password })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username, email, password) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password,
    });
  }
  setting() {
    return axios.get(API_URL + "setting").then(response => {
      // if (response.data.settings.length > -1) {
      localStorage.setItem("setting", JSON.stringify(response.data));
      // }
      return response.data;
    })
  }
}


export default new AuthService();