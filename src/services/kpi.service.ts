import Config from "../constants/config.constants"
import axios from "../utils/request.interceptor";
import { FilterPayload } from '../interfaces/kpis.interface';

export const fetchAllKpis = async (role:string) => {
  try {
    const response = axios.get(`${Config.baseUrl}/law/summary/${role}`)
    return (await response).data;
  } catch (error) {
    console.log('An error occured => ', error);
  }
}

export const filterAndSummarizeDateRange = async (role:string, filterPayload?: FilterPayload) => {
  try {
    const response = axios.get(`${Config.baseUrl}/law/filter-by-date/${role}`, {
      params: filterPayload
    })
    return (await response).data;
  } catch (error) {
    console.log('An error occured => ', error);
  }
}


export const getRequirementsByImpact = async (role:string, filterPayload: { impact: "weak" | "medium" | "major" | "critical" }) => {
  try {
    const response = axios.get(`${Config.baseUrl}/law/requirements-by-impact/${role}`, {
      params: filterPayload
    })
    return (await response).data;
  } catch (error) {
    console.log('An error occured => ', error);
  }
}

export const getRequirementsPerFamily = async (role:string, filterPayload: { family: string }) => {
  try {
    const response = axios.get(`${Config.baseUrl}/law/requirements-per-family/${role}`, {
      params: filterPayload
    })
    return (await response).data;
  } catch (error) {
    console.log('An error occured => ', error);
  }
}

export const getApplicableRequirements = async (role:string, filterPayload: { applicability: "yes" | "no" }) => {
  try {
    const response = axios.get(`${Config.baseUrl}/law/requirements-per-family/${role}`, {
      params: filterPayload
    })
    return (await response).data;
  } catch (error) {
    console.log('An error occured => ', error);
  }
}

export const getRequirementsByDepartment = async (role:string, filterPayload: { department: string }) => {
  try {
    const response = axios.get(`${Config.baseUrl}/law/requirements-per-family/:${role}`, {
      params: filterPayload
    })
    return (await response).data;
  } catch (error) {
    console.log('An error occured => ', error);
  }
}
