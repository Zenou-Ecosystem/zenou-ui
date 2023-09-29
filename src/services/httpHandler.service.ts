import axios from "../utils/request.interceptor";
import Config from '../constants/config.constants';
import { Dispatch } from 'redux';
import { ModalActionsTypes } from '../store/action-types/modal.actions';
import { singularize } from '../utils/singularize.util';
import { LoaderActionTypes } from '../store/action-types/loader.actions';
import configConstants from '../constants/config.constants';

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
    dispatch({ type: LoaderActionTypes.SHOW_LOADER, payload: { type: "PROGRESS" } });

    axios(payload).then(
      response => {
        if(payload.method === 'PATCH' || payload.method === 'PUT') {
          dispatch({ type: actionType, payload: {...payload.data, id: payload.id} });
        }else {
          dispatch({ type: actionType, payload: !payload?.id ? response.data : payload.id });
        }

        if(payload.method !== 'GET') {

          let headerText = payload.method === 'PUT' || payload.method === 'PATCH' ?
            `Updated ${singularize(actionType.split('_')[1].toLowerCase())} with success`:
              payload.method === 'POST' ? `Created ${singularize(actionType.split('_')[1].toLowerCase())} with success`
              :`Deleted ${singularize(actionType.split('_')[1].toLowerCase())} with success`;

          if(payload.showModalAfterRequest) {

            if( payload.url === `${configConstants.authBaseUrl}/login` && response.data?.access_token) {

            } else {
              dispatch({
                type: ModalActionsTypes.SHOW_MODAL,
                payload: {
                  severity: response.data?.status >= 400 ? 'DANGER' :'SUCCESS',
                  headerText: response.data?.status >= 400 ? "Error" : headerText,
                  bodyText: response.data?.message ?? "This action completed with success. Continue with the system!",
                }
              });
            }

          }
        }

      }
    ).catch(() => {
      if(payload.showModalAfterRequest) {
        dispatch({
          type: ModalActionsTypes.SHOW_MODAL,
          payload: {
            severity: 'DANGER',
            headerText: "An error occurred!",
            bodyText: "An unexpected error occured during. Please make sure you have active internet connection.",
          }
        });
      }
    }).finally(() => {
      dispatch({ type: LoaderActionTypes.HIDE_LOADER });
    });
  }
}
