import React, { createContext, useReducer } from 'react'
import { ActionTypes } from '../store/action-types';
import { initialState } from '../store/state';
import { Reducers } from '../store/reducers';

export const ApplicationContext = createContext<{
    state: any;
    dispatch: React.Dispatch<ActionTypes>;
}>({
    state: initialState,
    dispatch: () => { },
});

export default function AppContext(props: { children: any }) {
    const { children } = props;
    const [state, dispatch] = useReducer<any>(Reducers, {});
    return (
        <ApplicationContext.Provider value={{ state, dispatch }}>
            { children }
        </ApplicationContext.Provider>
    );
}
