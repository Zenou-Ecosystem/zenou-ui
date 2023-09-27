import { ILoader } from '../../interfaces/loader.interface';
import { ILoaderActions, LoaderActionTypes } from '../action-types/loader.actions';
import { loaderState } from '../state/loader.state';

export const loaderReducer = (state: ILoader = loaderState, action: ILoaderActions) => {
  switch (action.type) {
    case LoaderActionTypes.SHOW_LOADER:
      state = {
        type: action.payload.type,
        isOpened: true
      }
      return state;
    case LoaderActionTypes.HIDE_LOADER:
    default:
      state = loaderState;
      return state;
  }
}
