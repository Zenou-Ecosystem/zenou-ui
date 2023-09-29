import { IActionActions } from './action.actions';
import { ICompanyActions } from './company.actions';
import { IControlActions } from './control.actions';
import { ILawActions } from './laws.actions';
import { IPersonnelActions } from './personnel.actions';
import { ModalActionsTypes } from './modal.actions';
import { LoaderActionTypes } from './loader.actions';
import { IUserActions } from './user.actions';

export type ActionTypes = {
  actions: IActionActions,
  company: ICompanyActions,
  control: IControlActions,
  laws: ILawActions,
  personnel: IPersonnelActions,
  modal: ModalActionsTypes,
  loader: LoaderActionTypes,
  user: IUserActions
}
