import Config from "../constants/config.constants"
import { ICompany } from "../interfaces/company.interface"

export const fecthCompanies = async () => {
    return await fetch(`${Config.baseUrl}/company`)
}

export const createCompany = async (payload: ICompany) => {
    return await fetch(`${Config.baseUrl}/company`, {
        method: 'POST', body: JSON.stringify(payload), headers: {
            'content-type': 'application/json'
        }
    })
}

