import { IUser } from '../../interfaces/user.interface';

export enum UserActionTypes {
  FETCH_USER = "FETCH_USER",
  AUTHENTICATE_USER = "AUTHENTICATE_USER",
  UN_AUTHENTICATE_USER = "UN_AUTHENTICATE_USER",
  VIEW_USER = "VIEW_USER",
}

export type IUserActions = {
  type: UserActionTypes;
  payload?: Partial<IUser> | object | string | number | [];
};
