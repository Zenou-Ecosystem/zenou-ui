import { combineReducers } from 'redux';
import { actionReducer } from './actions.reducer';
import { companyReducer } from './company.reducer';
import { controlReducer } from './control.reducer';
import { lawReducer } from './laws.reducer';
import { personnelReducer } from './personnel.reducer';
import { modalReducer } from './modal.reducer';
import { loaderReducer } from './loader.reducer';

export const Reducers = combineReducers({
  actions: actionReducer,
  companies: companyReducer,
  controls: controlReducer,
  laws: lawReducer,
  users: personnelReducer,
  modal: modalReducer,
  loader: loaderReducer
})
