import React, { createContext, useReducer } from 'react'
import { IActionActions } from '../store/action-types/action.actions';
import { actionReducer } from '../store/reducers/actions.reducer';
import { actionState } from '../store/state/action.state';


export const ActionsContext = createContext<{
    state: any; dispatch: React.Dispatch<IActionActions>;
}>
    ({
        state: actionState,
        dispatch: function () { }
    });

export default function ActionsContextProvider(props: { children: any }) {
    const { children } = props;
    const [state, dispatch] = useReducer<any>(actionReducer, {})
    return (
        <ActionsContext.Provider value={{ state, dispatch }}>
            {children}
        </ActionsContext.Provider>
    )
}
