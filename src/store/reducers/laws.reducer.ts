import { archiveLaw, createLaw, deleteLaw } from '../../services/laws.service';
import { LawActions } from "../action-types/laws.actions";

export const lawReducer = async (state: any, action: LawActions) => {
    switch (action.type) {
        case "ADD_LAW":
            const data = await createLaw(action.payload as any);
            return { ...state, data, hasCreated: true };
        case "DELETE_LAW":
            const response = await deleteLaw(action.payload as any);
            console.log(response, await state);
            // const newState = (await state)?.data.filter((data: any) => data.id !== action.payload);
            return state;
        case "ARCHIVE_LAW":
            await archiveLaw(action.payload as any);
            return state;
        default:
        //    console.log('Do nothing');

    }
}
