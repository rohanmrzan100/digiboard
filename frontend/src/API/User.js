import axios from "axios";
import { errorToast, successToast } from "../components/utils/Toast";
import { baseURL } from "../Constants";

axios.defaults.baseURL = baseURL;
axios.defaults.headers.post["Content-Type"] = "application/json";
const headers = {
  Authorization: localStorage.getItem("token"),
};
export const register = async (data) => {
  const response = await axios.post("/api/user/register", data);
  return response.data;
};

export const login = async (data) => {
  const response = await axios.post("/api/user/login", data);

  return response.data;
};

export const getUserData = async () => {
  const response = await axios.get("/api/user/content", { headers: headers });
  return response.data;
};

export const deleteMedia = async (id) => {
  try {
    const response = await axios.delete(`api/user/delete_media/${id}`, {
      headers: headers,
    });
    successToast("Media deleted successfully");
    return response.data;
  } catch (error) {
    errorToast(error.response.data.msg);
    return error;
  }
};

export const uploadMedia = async (formdata) => {
  await axios.post(baseURL + "api/media/upload", formdata, {
    headers: {
      Authorization: localStorage.getItem("token"),
      "Content-Type": "multipart/form-data",
    },
  });
};
