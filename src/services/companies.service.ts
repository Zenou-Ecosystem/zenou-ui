import Config from "../constants/config.constants"
import { ICompany } from "../interfaces/company.interface"
import axios from "../utils/request.interceptor";

export const fecthCompanies = async () => {
    try {
        const response = axios.get(`${Config.baseUrl}/company`)
        return (await response).data;
    } catch (error) {
        console.log('An error occured => ', error);
    }
}

export const createCompany = async (payload: ICompany) => {
    try {
        const response = await axios.post(`${Config.baseUrl}/company`, payload, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.log('An error occured => ', error);
    }
}

export const updateCompany = async (id: string | number, data: any) => {
    try {
        const response = await axios.patch(`${Config.baseUrl}/company/${id}`, data);
        return (await response).data;
    } catch (error) {
        console.log('An error occured => ', error);
    }
}

export const deleteCompany = async (id: string | number) => {
    try {
        const response = await axios.delete(`${Config.baseUrl}/company/${id}`);
        return response.data;
    } catch (error) {
        console.log('An error occured => ', error);
    }
}
