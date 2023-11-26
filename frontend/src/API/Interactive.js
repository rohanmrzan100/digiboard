import axios from "axios";
import { baseURL } from "../Constants";

axios.defaults.baseURL = baseURL;
axios.defaults.headers.post["Content-Type"] = "application/json";
const headers = {
  Authorization: localStorage.getItem("token"),
};

export const getInteractive = async () => {
  const response = await axios.get(
    `api/interactive/get`,

    { headers: headers }
  );
  console.log(response.data);
  return response.data;
};

export const addMediaToInteractive = async (array) => {
  const response = await axios.post(
    `api/interactive/add`,
    { array: array },

    { headers: headers }
  );
  console.log(response.data);
  return response.data;
};

export const PlayInteractive = async (id) => {
  const response = await axios.post(
    `api/interactive/play/${id}`,
    {},

    { headers: headers }
  );
  console.log(response.data);
  return response.data;
};

export const RemoveMediaFromInteractive = async (id) => {
  const response = await axios.delete(
    `api/interactive/remove/${id}`,

    { headers: headers }
  );
  console.log(response.data);
  return response.data;
};
