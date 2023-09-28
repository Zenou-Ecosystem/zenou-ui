import axios from "../utils/request.interceptor";
import Config from '../constants/config.constants';
import { onError, onSuccess } from '../store/action-types/app.actions';
import { Dispatch } from 'redux';
import { ModalActionsTypes } from '../store/action-types/modal.actions';
import { singularize } from '../utils/singularize.util';
import { LoaderActionTypes } from '../store/action-types/loader.actions';

interface IHttpPayload {
  method: 'POST' | "PUT" | "GET" | "DELETE" | "PATCH";
  endpoint: string;
  headers?: object | Record<any, any>;
  params?: object | Record<any, any>;
  data?: any;
  baseUrl?: string;
  url?: string;
  id?: string | number;
  showModalAfterRequest?: boolean;
}

export default function httpHandlerService(payload: IHttpPayload, actionType: any) {
  !payload?.baseUrl && (payload.baseUrl = `${Config.baseUrl}/${payload.endpoint}/${!payload?.id ? '' : payload?.id}`);
  !payload?.headers && (payload.headers = {
    "Content-Type": "application/json"
  });

  // @ts-ignore
  delete payload.endpoint;
  payload.url = payload.baseUrl;
  delete payload.baseUrl;

  return (dispatch: Dispatch) => {
    dispatch({ type: LoaderActionTypes.SHOW_LOADER, payload: { type: "PROGRESS" } })
    axios(payload).then(
      response => {
        if(payload.method === 'PATCH' || payload.method === 'PUT') {
          dispatch(onSuccess({...payload.data, id: payload.id }, actionType))
        }else {

        dispatch(onSuccess( !payload?.id ? response.data : payload.id, actionType))
        }

        if(payload.method !== 'GET') {
          let headerText = payload.method === 'PUT' || payload.method === 'PATCH' ?
            `Updated ${singularize(actionType.split('_')[1].toLowerCase())} with success`:
              payload.method === 'POST' ? `Created ${singularize(actionType.split('_')[1].toLowerCase())} with success`
              :`Deleted ${singularize(actionType.split('_')[1].toLowerCase())} with success`;

          if(payload.showModalAfterRequest) {
            dispatch(onError({
              severity: 'SUCCESS',
              headerText,
              bodyText: "This action completed with success. Continue with the system!",
            }, ModalActionsTypes.SHOW_MODAL));
          }
        }

      }
    ).catch(() => {
      if(payload.showModalAfterRequest) {
        dispatch(onError({
          severity: 'DANGER',
          headerText: "An error occurred!",
          bodyText: "An unexpected error occured during. Please make sure you have active internet connection.",
        }, ModalActionsTypes.SHOW_MODAL));
      }
    }).finally(() => {
      dispatch({ type: LoaderActionTypes.HIDE_LOADER });
    });
  }
}
