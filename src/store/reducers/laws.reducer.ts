import { ILawActions, LawActionTypes } from '../action-types/laws.actions';
import { ILaws } from '../../interfaces/laws.interface';
import { lawsState } from '../state/laws.state';

export const lawReducer = (state: ILaws[] = lawsState, action: ILawActions | any) => {
    switch (action.type) {
        case LawActionTypes.FETCH_LAWS:
            state = action.payload as ILaws[];
            return state;

        case LawActionTypes.ADD_LAW:
            state = [action.payload as ILaws, ...state];
            return state;

        case LawActionTypes.EDIT_LAW:
            const itemNumber = state.findIndex((item) => item.id === action.payload?.id);
            state = state.filter((item) => item.id !== action.payload?.id);
            state.splice(itemNumber, 0, action.payload as ILaws)
            return state;

        case LawActionTypes.DELETE_LAW:
            state = state.filter((item) => item.id !== action.payload);
            return state;

        default:
            return state;
    }
}
