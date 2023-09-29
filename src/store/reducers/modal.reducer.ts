import { IModal } from '../../interfaces/modal.interface';
import { IModalActions, ModalActionsTypes } from '../action-types/modal.actions';
import { modalState } from '../state/modal.state';

export const modalReducer = (state: IModal | null = modalState, action: IModalActions) => {
  switch (action.type) {
    case ModalActionsTypes.SHOW_MODAL:
      state = action.payload
      break;
    case ModalActionsTypes.HIDE_MODAL:
      state = null;
      break;
  }
  return state;
}
