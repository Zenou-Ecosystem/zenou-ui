import React, { createContext, useReducer } from 'react'
import { ActionStoreActions } from '../store/action-types/action.actions';
import { actionReducer } from '../store/reducers/actions.reducer';


export const ActionsContext = createContext<{
    state: any; dispatch: React.Dispatch<ActionStoreActions>;
}>
    ({
        state: {},
        dispatch: function () { }
    });

function ActionsContextProvider(props: { children: any }) {
    const { children } = props;
    const [state, dispatch] = useReducer<any>(actionReducer, {})
    return (
        <ActionsContext.Provider value={{ state, dispatch }}>
            {children}
        </ActionsContext.Provider>
    )
}

export default ActionsContextProvider