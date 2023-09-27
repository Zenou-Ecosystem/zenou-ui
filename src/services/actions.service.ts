import Config from '../constants/config.constants';
import { IActions } from '../interfaces/actions.interface';
import axios from '../utils/request.interceptor';
import { Dispatch } from 'redux';
import { ActionsActionTypes, IActionActions } from '../store/action-types/action.actions';
import { onError, onSuccess } from '../store/action-types/app.actions';
import { IModalActions, ModalActionsTypes } from '../store/action-types/modal.actions';

export const fetchActions = () => {
    return (dispatch: Dispatch<IActionActions>) => {
        axios.get(`${Config.baseUrl}/actions`, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(
          (response) => {
              dispatch(onSuccess(response.data, ActionsActionTypes.FETCH_ACTIONS))
          }
        ).catch(
          (error) => {
              dispatch(onError({
                severity: 'DANGER',
                headerText: "An error occured!",
                bodyText: "An unexpected error occured during. Please make sure you have active internet connection.",
              }, ModalActionsTypes.SHOW_MODAL));
          }
        )
    }
}

export const createActions = (payload: IActions) => {
    return (dispatch: Dispatch<IActionActions>) => {
        axios.post(`${Config.baseUrl}/actions`, payload,{
            headers: {
                "Content-Type": "application/json"
            }
        }).then(
          (response) => {
              dispatch(onSuccess(response.data, ActionsActionTypes.ADD_ACTION));
          }
        ).catch(
          (error) => {
            dispatch(onError({
              severity: 'DANGER',
              headerText: "An error occured!",
              bodyText: "An unexpected error occured during. Please make sure you have active internet connection.",
            }, ModalActionsTypes.SHOW_MODAL));
          }
        )
    }
}

export const updateAction = (id: string | number, payload: Partial<IActions>) => {
    return (dispatch: Dispatch<IActionActions>) => {
        axios.patch(`${Config.baseUrl}/actions/${id}`, payload,{
            headers: {
                "Content-Type": "application/json"
            }
        }).then(
          (response) => {
              dispatch(onSuccess(response.data, ActionsActionTypes.EDIT_ACTION))
          }
        ).catch(
          (error) => {
            dispatch(onError({
              severity: 'DANGER',
              headerText: "An error occured!",
              bodyText: "An unexpected error occured during. Please make sure you have active internet connection.",
            }, ModalActionsTypes.SHOW_MODAL));
          }
        )
    }
}

export const deleteAction = (id: string | number) => {
    return (dispatch: Dispatch<IActionActions>) => {
        axios.delete(`${Config.baseUrl}/actions/${id}`,{
            headers: {
                "Content-Type": "application/json"
            }
        }).then(
          (response) => {
              dispatch(onSuccess(id, ActionsActionTypes.DELETE_ACTION))
          }
        ).catch(
          (error) => {
            dispatch(onError({
              severity: 'DANGER',
              headerText: "An error occured!",
              bodyText: "An unexpected error occured during. Please make sure you have active internet connection.",
            }, ModalActionsTypes.SHOW_MODAL));
          }
        )
    }
}
