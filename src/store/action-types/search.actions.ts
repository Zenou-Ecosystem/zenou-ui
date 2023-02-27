export enum SearchActionTypes {
    GLOBAL_SEARCH = 'GLOBAL_SEARCH',
    MODULE_SEARCH = 'MODULE_SEARCH',
    FILTER = 'FILTER',
}

export type GlobalStateActions = {
    type: SearchActionTypes,
    payload: object | string | number | []
}