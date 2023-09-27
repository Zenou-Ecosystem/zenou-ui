import { ILaws } from "../../interfaces/laws.interface"

export enum LawActionTypes {
    FETCH_LAWS = 'FETCH_LAWS',
    ADD_LAW = 'ADD_LAW',
    DELETE_LAW = 'DELETE_LAW',
    EDIT_LAW = 'EDIT_LAW',
    VIEW = "VIEW_LAW",
    ARCHIVE_LAW = "ARCHIVE_LAW",
    RESTORE_ARCHIVED_LAW="RESTORE_ARCHIVED_LAW",
    GET_ARCHIVED_LAWS="GET_ARCHIVED_LAWS"
}

export type ILawActions = {
    type: LawActionTypes,
    payload: Partial<ILaws> | object | string | number | []
}
