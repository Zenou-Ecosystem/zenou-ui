import { ICompany } from "../interfaces/company.interface"

export const fecthCompanies = async () => {
    return await fetch('http://localhost:3000/company')
}

export const createCompany = async (payload: ICompany) => {
    return await fetch('http://localhost:3000/company', {
        method: 'POST', body: JSON.stringify(payload), headers: {
            'content-type': 'application/json'
        }
    })
}

