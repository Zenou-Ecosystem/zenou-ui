import { actionState } from './action.state';
import { companyState } from './company.state';
import { controlState } from './control.state';
import { lawsState } from './laws.state';
import { personnelState } from './personnel.state';
import { modalState } from './modal.state';
import { loaderState } from './loader.state';
import { userState } from './user.state';
import { statisticsState } from './statistics.state';

export const initialState = {
  actions: actionState,
  companies: companyState,
  controls: controlState,
  laws: lawsState,
  users: personnelState,
  modal: modalState,
  loader: loaderState,
  user: userState,
  statistics: statisticsState
};
