import Config from "../constants/config.constants"
import axios from "../utils/request.interceptor";

export const login = async (payload: any) => {
    try {
        const response = await axios.post(`${Config.authBaseUrl}/auth/login`, payload, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.log('An error occured during login');
    }
}

export const register = async (payload: any) => {
    try {
        const response = await axios.post(`${Config.authBaseUrl}/auth/register`, payload, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.log('An error occured during register');
    }
}