import { IPersonnel } from "../../interfaces/personnel.interface";

export enum PersonnelActionTypes {
  FETCH_ALL_PERSONNEL = "FETCH_ALL_PERSONNEL",
  ADD_PERSONNEL = "ADD_PERSONNEL",
  DELETE_PERSONNEL = "DELETE_PERSONNEL",
  EDIT_PERSONNEL = "EDIT_PERSONNEL",
  VIEW = "VIEW_PERSONNEL",
}

export type IPersonnelActions = {
  type: PersonnelActionTypes;
  payload: Partial<IPersonnel> | object | string | number | [];
};
