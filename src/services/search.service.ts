import axios from "axios"
import Config from "../constants/config.constants"

export const simpleSearch = async (field: string, query: string) => {
    try {
        const response = await axios.get(`${Config.baseUrl}/search?${field}=${query}`);
        return response.data;
    } catch (error) {
        console.log('An error occured => ', error);
    }
}