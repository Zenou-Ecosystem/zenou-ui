import { IControl } from "../../interfaces/controls.interface"

export enum ControlActionTypes {
    FETCH_CONTROLS = 'FETCH_CONTROLS',
    ADD_CONTROL = 'ADD_CONTROL',
    DELETE_CONTROL = 'DELETE_CONTROL',
    EDIT_CONTROL = 'EDIT_CONTROL',
    VIEW = "VIEW_CONTROL"
}

export type ControlActions = {
    type: ControlActionTypes,
    payload: Partial<IControl> | object | string | number | []
}