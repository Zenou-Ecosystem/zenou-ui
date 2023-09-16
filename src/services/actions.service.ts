import Config from "../constants/config.constants"
import { IActions } from "../interfaces/actions.interface";
import axios from "../utils/request.interceptor";


export const fetchActions = async () => {
    try {
        const response = axios.get(`${Config.baseUrl}/actions`)
        return (await response).data;
    } catch (error) {
        console.log('An error occured => ', error);
    }
}

export const createAction = async (payload: IActions) => {
    try {
        const response = await axios.post(`${Config.baseUrl}/actions`, payload, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.log('An error occured => ', error);
    }
}

export const updateAction = async (id: string | number, data: any) => {
    try {
        const response = await axios.patch(`${Config.baseUrl}/actions/${id}`, data);
        return (await response).data;
    } catch (error) {
        console.log('An error occured => ', error);
    }
}

export const deleteAction = async (id: string | number) => {
    try {
        const response = await axios.delete(`${Config.baseUrl}/actions/${id}`);
        return response.data;
    } catch (error) {
        console.log('An error occured => ', error);
    }
}
