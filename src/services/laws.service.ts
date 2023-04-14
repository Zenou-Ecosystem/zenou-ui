import axios from "axios"
import Config from "../constants/config.constants"
import { ILaws } from "../interfaces/laws.interface";

export const fetchLaws = async () => {
    try {
        const response = axios.get(`${Config.baseUrl}/law`);
        return (await response).data;
    } catch (error) {
        console.log('An error occured => ', error);
    }
}

export const createLaw = async (payload: ILaws) => {
    try {
        const response = await axios.post(`${Config.baseUrl}/law`, payload, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.log('An error occured => ', error);
    }
}

export const deleteLaw = async (id: string | number) => {
    try {
        const response = await axios.delete(`${Config.baseUrl}/law/${id}`);
        return response.data;
    } catch (error) {
        console.log('An error occured => ', error);
    }
}
