import Config from "../constants/config.constants"
import { IDepartment } from "../interfaces/department.interface";
import axios from "../utils/request.interceptor";


export const fetchDepartments = async () => {
    try {
        const response = axios.get<IDepartment[]>(`${Config.baseUrl}/departments`)
        return (await response).data;
    } catch (error) {
        console.log('An error occured => ', error);
    }
}

export const createDepartment = async (payload: IDepartment) => {
    try {
        const response = await axios.post(`${Config.baseUrl}/departments`, payload, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.log('An error occured => ', error);
    }
}

export const deleteDepartment = async (id: string | number) => {
    try {
        const response = await axios.delete(`${Config.baseUrl}/departments/${id}`);
        return response.data;
    } catch (error) {
        console.log('An error occured => ', error);
    }
}
