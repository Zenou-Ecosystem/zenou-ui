import { createLaw, deleteLaw } from "../../services/laws.service";
import { LawActions } from "../action-types/laws.actions";

export const lawReducer = async (state: any, action: LawActions) => {
    switch (action.type) {
        case "ADD_LAW":
            const data = await createLaw(action.payload as any);
            return { ...state, data, hasCreated: true };
        case "DELETE_LAW":
            const response = await deleteLaw(action.payload as any);
            console.log(response);
            const newState = (await state)?.data.filter((data: any) => data.id !== action.payload);
            return { ...newState };
        default:
        //    console.log('Do nothing');

    }
}
