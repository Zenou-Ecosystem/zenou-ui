export enum CompanyActionTypes {
    FETCH_COMPANIES = 'FETCH_COMPANIES',
    ADD_COMPANY = 'ADD_COMPANY',
    DELETE_COMPANY = 'DELETE_COMPANY',
    EDIT_COMPANY = 'EDIT_COMPANY',
    VIEW = "VIEW_COMPANY"
}

export type ICompanyActions = {
    type: CompanyActionTypes,
    payload: object | string | number | []
}
