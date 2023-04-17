import Config from "../constants/config.constants"
import { IControl } from "../interfaces/controls.interface"
import axios from "../utils/request.interceptor";

export const fetchControls = async () => {
    try {
        const response = axios.get(`${Config.baseUrl}/controls`)
        return (await response).data;
    } catch (error) {
        console.log('An error occured => ', error);
    }
}

export const createControl = async (payload: IControl) => {
    try {
        const response = await axios.post(`${Config.baseUrl}/controls`, payload, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.log('An error occured => ', error);
    }
}

export const deleteControl = async (id: string | number) => {
    try {
        const response = await axios.delete(`${Config.baseUrl}/controls/${id}`);
        return response.data;
    } catch (error) {
        console.log('An error occured => ', error);
    }
}
