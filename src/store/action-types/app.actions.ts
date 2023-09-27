import { IActions } from '../../interfaces/actions.interface';
import { ActionsActionTypes } from './action.actions';
import { CompanyActionTypes } from './company.actions';
import { ControlActionTypes } from './control.actions';
import { LawActionTypes } from './laws.actions';
import { PersonnelActionTypes } from './personnel.actions';
import { IModal } from '../../interfaces/modal.interface';
import { ModalActionsTypes } from './modal.actions';

type ISuccessData = IActions | IActions[] | IModal | string | number;

type ITypes = ActionsActionTypes
  | CompanyActionTypes
  | ControlActionTypes
  | LawActionTypes
  | PersonnelActionTypes
  | ModalActionsTypes;

export const onSuccess = (data: ISuccessData, type: ITypes | any) => {
  return {
    type,
    payload: data,
  };
};

export const onError = (error: IModal, type: ITypes | any) => {
  return {
    type,
    payload: error,
  };
};
