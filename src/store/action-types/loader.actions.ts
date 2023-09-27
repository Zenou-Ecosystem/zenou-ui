import { ILoader } from '../../interfaces/loader.interface';


export enum LoaderActionTypes {
  SHOW_LOADER = 'SHOW_LOADER',
  HIDE_LOADER = 'HIDE_LOADER',
}

export type ILoaderActions = {
  type: LoaderActionTypes,
  payload: ILoader
}
