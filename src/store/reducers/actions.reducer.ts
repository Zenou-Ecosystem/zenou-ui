import { ActionsActionTypes, IActionActions } from '../action-types/action.actions';
import { actionState } from '../state/action.state';
import { IActions } from '../../interfaces/actions.interface';

export const actionReducer = (state: IActions[] = actionState, action: IActionActions | any) => {
    switch (action.type) {
        case ActionsActionTypes.FETCH_ACTIONS:
            state = action.payload as IActions[];
            return state;

        case ActionsActionTypes.ADD_ACTION:
          state = [action.payload as IActions, ...state];
          return state;

        case ActionsActionTypes.EDIT_ACTION:
            const itemNumber = state.findIndex((item) => item.id === action.payload?.id);
            state = state.filter((item) => item.id !== action.payload?.id);
            state.splice(itemNumber, 0, action.payload as IActions)
            return state;

        case ActionsActionTypes.DELETE_ACTION:
            state = state.filter((item) => item.id !== action.payload);
            return state;
        default:
            return state;
    }
}
