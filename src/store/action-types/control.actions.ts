import { IControl } from "../../interfaces/controls.interface"

export enum ControlActionTypes {
    FETCH_CONTROLS = 'FETCH_CONTROLS',
    ADD_CONTROL = 'ADD_CONTROLS',
    DELETE_CONTROL = 'DELETE_CONTROLS',
    EDIT_CONTROL = 'EDIT_CONTROLS',
    VIEW = "VIEW_CONTROLS"
}

export type IControlActions = {
    type: ControlActionTypes,
    payload: Partial<IControl> | object | string | number | []
}
