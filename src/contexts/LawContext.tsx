import React, { createContext, useReducer } from 'react'
import { LawActions } from '../store/action-types/laws.actions';
import { lawReducer } from '../store/reducers/laws.reducer';


export const LawContext = createContext<{
    state: any; dispatch: React.Dispatch<LawActions>;
}>
    ({
        state: {},
        dispatch: function () { }
    });

function LawContextProvider(props: { children: any }) {
    const { children } = props;
    const [state, dispatch] = useReducer<any>(lawReducer, {})
    return (
        <LawContext.Provider value={{ state, dispatch }}>
            {children}
        </LawContext.Provider>
    )
}

export default LawContextProvider;