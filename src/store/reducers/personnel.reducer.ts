import { IPersonnelActions, PersonnelActionTypes } from '../action-types/personnel.actions';
import { IPersonnel } from '../../interfaces/personnel.interface';
import { personnelState } from '../state/personnel.state';

export const personnelReducer = (
  state: IPersonnel[] = personnelState,
  action: IPersonnelActions | any
) => {
  switch (action.type) {
    case PersonnelActionTypes.FETCH_ALL_PERSONNEL:
      state = action.payload as IPersonnel[];
      return state;

    case PersonnelActionTypes.ADD_PERSONNEL:
      state = [action.payload as IPersonnel, ...state];
      return state;

    case PersonnelActionTypes.EDIT_PERSONNEL:
      const itemNumber = state.findIndex((item) => item.id === action.payload?.id);
      state = state.filter((item) => item.id !== action.payload?.id);
      state.splice(itemNumber, 0, action.payload as IPersonnel)
      return state;

    case PersonnelActionTypes.DELETE_PERSONNEL:
      state = state.filter((item) => item.id !== action.payload);
      return state;
    default:
      return state;
  }
};
