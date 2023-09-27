import Config from "../constants/config.constants"
import { ILaws } from "../interfaces/laws.interface";
import axios from "../utils/request.interceptor";
import { Dispatch } from 'redux';
import { ActionsActionTypes, IActionActions } from '../store/action-types/action.actions';
import { onError, onSuccess } from '../store/action-types/app.actions';
import { IActions } from '../interfaces/actions.interface';
import { ILawActions, LawActionTypes } from '../store/action-types/laws.actions';
import { ModalActionsTypes } from '../store/action-types/modal.actions';

export const fetchLaws = () => {
    return (dispatch: Dispatch<ILawActions>) => {
        axios.get(`${Config.baseUrl}/law`, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(
          (response) => {
              dispatch(onSuccess(response.data, LawActionTypes.FETCH_LAWS))
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

export const createLaw = (payload: ILaws) => {
    return (dispatch: Dispatch<ILawActions>) => {
        axios.post(`${Config.baseUrl}/law`, payload,{
            headers: {
                "Content-Type": "application/json"
            }
        }).then(
          (response) => {
              dispatch(onSuccess(response.data, LawActionTypes.ADD_LAW))
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

export const updateLaw = (id: string | number, payload: Partial<ILaws>) => {
    return (dispatch: Dispatch<ILawActions>) => {
        axios.patch(`${Config.baseUrl}/law/${id}`, payload,{
            headers: {
                "Content-Type": "application/json"
            }
        }).then(
          (response) => {
              dispatch(onSuccess(response.data, LawActionTypes.EDIT_LAW))
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

export const deleteLaw = (id: string | number) => {
    return (dispatch: Dispatch<ILawActions>) => {
        axios.delete(`${Config.baseUrl}/law/${id}`,{
            headers: {
                "Content-Type": "application/json"
            }
        }).then(
          (response) => {
              dispatch(onSuccess(id, LawActionTypes.DELETE_LAW))
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
