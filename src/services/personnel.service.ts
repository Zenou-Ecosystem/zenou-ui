import Config from "../constants/config.constants";
import { IPersonnel } from "../interfaces/personnel.interface";
import axios from "../utils/request.interceptor";

export const fetchAllPersonnel = async () => {
  try {
    const response = axios.get(`${Config.authBaseUrl}/user`);
    return (await response).data;
  } catch (error) {
    console.log("An error occured => ", error);
  }
};

export const createPersonnel = async (payload: IPersonnel) => {
  try {
    const response = await axios.post(`${Config.baseUrl}/personnel`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log("An error occured => ", error);
  }
};

export const updatePersonnel = async (id: string | number, data: any) => {
  try {
    const response = await axios.patch(`${Config.baseUrl}/personnel/${id}`, data);
    return (await response).data;
  } catch (error) {
    console.log('An error occured => ', error);
  }
}

export const deletePersonnel = async (id: string | number) => {
  try {
    const response = await axios.delete(`${Config.baseUrl}/law/${id}`);
    return response.data;
  } catch (error) {
    console.log("An error occured => ", error);
  }
};
