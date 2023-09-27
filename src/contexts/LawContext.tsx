import React, { createContext, useReducer } from 'react'
import { ILawActions } from '../store/action-types/laws.actions';
import { lawReducer } from '../store/reducers/laws.reducer';
import { lawsState } from '../store/state/laws.state';


export const LawContext = createContext<{
    state: any; dispatch: React.Dispatch<ILawActions>;
}>
    ({
        state: lawsState,
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
