import {
  createPersonnel,
  fetchAllPersonnel,
} from "../../services/personnel.service";
import { PersonnelActions } from "../action-types/personnel.actions";
import { register } from "../../services/auth.service";

export const personnelReducer = async (
  state: any,
  action: PersonnelActions
) => {
  switch (action.type) {
    case "ADD_PERSONNEL":
      const data = await register(action.payload as any);
      return { ...state, data, hasCreated: true };
    default:
    //    console.log('Do nothing');
  }
};
