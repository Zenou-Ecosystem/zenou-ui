import { IUserActions, UserActionTypes } from '../action-types/user.actions';
import { IUser } from '../../interfaces/user.interface';
import { userState } from '../state/user.state';
import { LocalStore } from '../../utils/storage.utils';
import { modalReducer } from './modal.reducer';
import { modalState } from '../state/modal.state';
import { ModalActionsTypes } from '../action-types/modal.actions';

export const userReducer = (
  state: IUser | null | undefined = userState,
  action: IUserActions | any
) => {
  switch (action.type) {
    case UserActionTypes.FETCH_USER:
      const isUser = LocalStore.get("USER_DATA");
      if(isUser) {
        state = isUser
      }
      break;

    case UserActionTypes.AUTHENTICATE_USER:
      if(action.payload && action.payload?.access_token) {
        LocalStore.set("USER_DATA", action.payload);
        state = action.payload
      }else {
        modalReducer(modalState, {type: ModalActionsTypes.SHOW_MODAL, payload: {
          severity: "DANGER",
            headerText: "Error!",
            bodyText: action.payload?.error ?? "Invalid email and password"
          }});
      }
      break;

    case UserActionTypes.UN_AUTHENTICATE_USER:
      LocalStore.remove("USER_DATA");
      state = userState;
      break;
  }

  return state;
};
