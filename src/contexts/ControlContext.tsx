import React, { createContext, useReducer } from 'react'
import { ControlActions } from '../store/action-types/control.actions';
import { controlReducer } from '../store/reducers/control.reducer';

export const ControlContext = createContext<{
    state: any; dispatch: React.Dispatch<ControlActions>;
}>
    ({
        state: {},
        dispatch: function () { }
    });

function ControlContextProvider(props: { children: any }) {
    const { children } = props;
    const [state, dispatch] = useReducer<any>(controlReducer, {})
    return (
        <ControlContext.Provider value={{ state, dispatch }}>
            {children}
        </ControlContext.Provider>
    )
}

export default ControlContextProvider