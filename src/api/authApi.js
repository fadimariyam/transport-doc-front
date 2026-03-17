import axios from "axios";

const API =
  import.meta.env.VITE_API;

export const loginApi = (data) => {

  return axios.post(
    API + "/auth/login",
    data
  );

};