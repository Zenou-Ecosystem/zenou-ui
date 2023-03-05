import { IActions } from "../../interfaces/actions.interface"

export enum ActionsActionTypes {
    FETCH_ACTIONS = 'FETCH_ACTIONS',
    ADD_ACTION = 'ADD_ACTION',
    DELETE_ACTION = 'DELETE_ACTION',
    EDIT_ACTION = 'EDIT_ACTION',
    VIEW = "VIEW_ACTION"
}

export type ActionStoreActions = {
    type: ActionsActionTypes,
    payload: Partial<IActions> | object | string | number | []
}