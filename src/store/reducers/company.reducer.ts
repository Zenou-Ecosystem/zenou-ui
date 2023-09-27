import { CompanyActionTypes, ICompanyActions } from '../action-types/company.actions';
import { ICompany } from '../../interfaces/company.interface';
import { companyState } from '../state/company.state';

export const companyReducer = (state: ICompany[] = companyState, action: ICompanyActions | any) => {
  switch (action.type) {
    case CompanyActionTypes.FETCH_COMPANIES:
      state = action.payload as ICompany[];
      return state;

    case CompanyActionTypes.ADD_COMPANY:
      state = [action.payload as ICompany, ...state];
      return state;

    case CompanyActionTypes.EDIT_COMPANY:
      const itemNumber = state.findIndex((item) => item.id === action.payload?.id);
      state = state.filter((item) => item.id !== action.payload?.id);
      state.splice(itemNumber, 0, action.payload as ICompany)
      return state;

    case CompanyActionTypes.DELETE_COMPANY:
      // state = state.filter((item) => item.id !== action.payload);
      break;
    default:
      return state;
  }
}
