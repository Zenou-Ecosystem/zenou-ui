import React, { createContext, useReducer } from 'react'
import { CompanyActions } from '../store/action-types/company.actions';
import { companyReducer } from '../store/reducers/company.reducer';

export const CompanyContext = createContext<{
  state: any; dispatch: React.Dispatch<CompanyActions>;
}>
  ({
    state: {},
    dispatch: function () { }
  });

function CompanyContextProvider(props: { children: any }) {
  const { children } = props;
  const [state, dispatch] = useReducer<any>(companyReducer, {})
  return (
    <CompanyContext.Provider value={{ state, dispatch }}>
      {children}
    </CompanyContext.Provider>
  )
}

export default CompanyContextProvider