import React, { createContext, useReducer } from "react";
import { PersonnelActions } from "../store/action-types/personnel.actions";
import { personnelReducer } from "../store/reducers/personnel.reducer";

export const PersonnelContext = createContext<{
  state: any;
  dispatch: React.Dispatch<PersonnelActions>;
}>({
  state: {},
  dispatch: function () {},
});

function PersonnelContextProvider(props: { children: any }) {
  const { children } = props;
  const [state, dispatch] = useReducer<any>(personnelReducer, {});
  return (
    <PersonnelContext.Provider value={{ state, dispatch }}>
      {children}
    </PersonnelContext.Provider>
  );
}

export default PersonnelContextProvider;
