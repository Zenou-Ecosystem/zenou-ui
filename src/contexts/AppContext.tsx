import React, { createContext, useReducer } from 'react'
import { GlobalStateActions } from '../store/action-types/search.actions';
import { globalStateReducer } from '../store/reducers/globalState.reducer';

export const ApplicationContext = createContext<{
    state: any;
    dispatch: React.Dispatch<GlobalStateActions>;
}>({
    state: {},
    dispatch: () => { },
});

function AppContext(props: { children: any }) {
    const { children } = props;
    const [state, dispatch] = useReducer<any>(globalStateReducer, {})
    return (
        <ApplicationContext.Provider value={{ state, dispatch }}>
            {
                children
            }
        </ApplicationContext.Provider>
    );
}

export default AppContext;
