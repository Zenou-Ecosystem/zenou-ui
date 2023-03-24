import { ILaws } from "../../interfaces/laws.interface"

export enum LawActionTypes {
    FETCH_LAWS = 'FETCH_LAWS',
    ADD_LAW = 'ADD_LAW',
    DELETE_LAW = 'DELETE_LAW',
    EDIT_LAW = 'EDIT_LAW',
    VIEW = "VIEW_LAW"
}

export type LawActions = {
    type: LawActionTypes,
    payload: Partial<ILaws> | object | string | number | []
}