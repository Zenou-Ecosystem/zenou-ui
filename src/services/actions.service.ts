import axios from "axios"
import Config from "../constants/config.constants"
import { IActions } from "../interfaces/actions.interface";


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

export const deleteAction = async (id: string | number) => {
    try {
        const response = await axios.delete(`${Config.baseUrl}/actions/${id}`);
        return response.data;
    } catch (error) {
        console.log('An error occured => ', error);
    }
}
