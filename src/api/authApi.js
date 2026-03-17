import axios from "axios";

const API =
  "http://localhost:5000/api";

export const loginApi = (data) => {

  return axios.post(
    API + "/auth/login",
    data
  );

};