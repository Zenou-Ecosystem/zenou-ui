import { createAction, deleteAction } from "../../services/actions.service";
import { ActionStoreActions } from "../action-types/action.actions";


export const actionReducer = async (state: any, action: ActionStoreActions) => {
    switch (action.type) {
        case "ADD_ACTION":
            const data = await createAction(action.payload as any);
            return { ...state, data, hasCreated: true };
        case "DELETE_ACTION":
            const response = await deleteAction(action.payload as any);
            // console.log(state);
            // const newState = state?.data.filter((data: any) => data.id !== action.payload);
            return state;
        default:
            throw new Error();
    }
}
