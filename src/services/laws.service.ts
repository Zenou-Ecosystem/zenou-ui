import Config from "../constants/config.constants"
import { ILaws } from "../interfaces/laws.interface";
import axios from "../utils/request.interceptor";

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
        return (await response).data;
    } catch (error) {
        console.log('An error occured => ', error);
    }
}

export const updateLaw = async (id: string | number, data: any) => {
    try {
        const response = await axios.patch(`${Config.baseUrl}/law/${id}`, data);
        return (await response).data;
    } catch (error) {
        console.log('An error occured => ', error);
    }
}

export const deleteLaw = async (id: string | number) => {
    try {
        const response = await axios.delete(`${Config.baseUrl}/law/${id}`);
        return (await response).data;
    } catch (error) {
        console.log('An error occured => ', error);
    }
}

export const archiveLaw = async (id: string | number) => {
    try {
        const response = await axios.delete(`${Config.baseUrl}/law/archive/${id}`);
        return (await response).data;
    } catch (error) {
        console.log('An error occured => ', error);
    }
}

export const restoreArchivedLaw = async (id: string | number) => {
    try {
        const response = await axios.patch(`${Config.baseUrl}/law/archive/${id}`);
        return (await response).data;
    } catch (error) {
        console.log('An error occured => ', error);
    }
}
export const getArchivedLaw = async () => {
    try {
        const response = await axios.get(`${Config.baseUrl}/law/archive/`);
        return response.data;
    } catch (error) {
        console.log('An error occured => ', error);
    }
}
