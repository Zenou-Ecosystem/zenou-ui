import { IModal } from '../../interfaces/modal.interface';

export enum ModalActionsTypes {
  SHOW_MODAL = 'SHOW_MODAL',
  HIDE_MODAL = 'HIDE_MODAL',
}

export type IModalActions = {
  type: ModalActionsTypes,
  payload: IModal
}
