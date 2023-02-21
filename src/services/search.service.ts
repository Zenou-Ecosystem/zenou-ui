import Config from "../constants/config.constants"

export const simpleSearch = async (field: string, query: string) => {
    return await fetch(`${Config.baseUrl}/search?${field}=${query}`)
}