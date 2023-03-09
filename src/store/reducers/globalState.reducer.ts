import { simpleSearch } from "../../services/search.service";
import { GlobalStateActions } from "../action-types/search.actions";

export const globalStateReducer = async (state: any, action: GlobalStateActions) => {

    switch (action?.type) {
        case "GLOBAL_SEARCH":
            const response = await simpleSearch((action.payload as any)?.index ?? 'laws', (action.payload as any).query);
            const data = response;
            return { ...state, ...data }

        case "MODULE_SEARCH":
            //
            break;
        case "FILTER":
            //
            break;

        default:
            console.log('Default search here');
            break;

    }
}