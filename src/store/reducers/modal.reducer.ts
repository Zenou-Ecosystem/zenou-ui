import { IModal } from '../../interfaces/modal.interface';
import { modalState } from '../state/modal.state';
import { IModalActions, ModalActionsTypes } from '../action-types/modal.actions';

export const modalReducer = (state: IModal | null, action: IModalActions) => {
  switch (action.type) {
    case ModalActionsTypes.SHOW_MODAL:
      state = action.payload
      return state;
    case ModalActionsTypes.HIDE_MODAL:
    default:
      state = null;
      return state;
  }
}
