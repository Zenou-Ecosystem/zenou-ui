import { createControl, deleteControl } from "../../services/control.service";
import { ControlActions } from "../action-types/control.actions";

export const controlReducer = async (state: any, action: ControlActions) => {
    switch (action.type) {
        case "ADD_CONTROL":
            const data = await createControl(action.payload as any);
            return { ...state, data, hasCreated: true };
        case "DELETE_CONTROL":
            const response = await deleteControl(action.payload as any);
            const newState = state.data.filter((data: any) => data.id !== action.payload);
            return { ...newState };
        default:
            throw new Error();
    }
}
