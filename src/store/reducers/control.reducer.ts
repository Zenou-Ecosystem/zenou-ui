import { createControl, deleteControl } from "../../services/control.service";
import { ControlActions } from "../action-types/control.actions";

export const controlReducer = async (state: any, action: ControlActions) => {

    if (action.type == "ADD_CONTROL") {
        const data = await createControl(action.payload as any);
        return { ...state, data, hasCreated: true };
    }

    if (action.type == "DELETE_CONTROL") {
        const response = await deleteControl(action.payload as any);
        console.log(response, state);
        const newState = state?.data.filter((data: any) => data.id !== action.payload);
        return { ...newState };
    }

}
