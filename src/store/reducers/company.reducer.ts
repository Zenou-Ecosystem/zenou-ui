import { createCompany, deleteCompany } from "../../services/companies.service";
import { CompanyActions } from "../action-types/company.actions";

export const companyReducer = async (state: any, action: CompanyActions) => {
  switch (action.type) {
    case "ADD_COMPANY":
      const data = await createCompany(action.payload as any);
      return { ...state, data, hasCreated: true };
    case "DELETE_COMPANY":
      const response = await deleteCompany(action.payload as any);
      const newState = state?.data.filter((data: any) => data.id !== action.payload);
      return { ...newState };
    default:
      throw new Error();
  }
}
