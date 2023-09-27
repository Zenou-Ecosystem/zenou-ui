import React, { createContext, useReducer } from 'react'
import { IControlActions } from '../store/action-types/control.actions';
import { controlReducer } from '../store/reducers/control.reducer';
import { controlState } from '../store/state/control.state';

export const ControlContext = createContext<{
    state: any; dispatch: React.Dispatch<IControlActions>;
}>
    ({
        state: controlState,
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
