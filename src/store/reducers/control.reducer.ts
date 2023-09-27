import { ControlActionTypes, IControlActions } from '../action-types/control.actions';
import { IControl } from '../../interfaces/controls.interface';
import { controlState } from '../state/control.state';
export const controlReducer = (state: IControl[] = controlState, action: IControlActions | any) => {
    switch (action.type) {
        case ControlActionTypes.FETCH_CONTROLS:
            state = action.payload as IControl[];
            return state;

        case ControlActionTypes.ADD_CONTROL:
            state = [action.payload as IControl, ...state];
            return state;

        case ControlActionTypes.EDIT_CONTROL:
            const itemNumber = state.findIndex((item) => item.id === action.payload?.id);
            state = state.filter((item) => item.id !== action.payload?.id);
            state.splice(itemNumber, 0, action.payload as IControl)
            return state;

        case ControlActionTypes.DELETE_CONTROL:
            state = state.filter((item) => item.id !== action.payload);
            return state;
        default:
            return state;
    }

}
