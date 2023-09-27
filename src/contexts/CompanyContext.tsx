import React, { createContext, useReducer } from 'react'
import { ICompanyActions } from '../store/action-types/company.actions';
import { companyReducer } from '../store/reducers/company.reducer';
import { companyState } from '../store/state/company.state';

export const CompanyContext = createContext<{
  state: any; dispatch: React.Dispatch<ICompanyActions>;
}>
  ({
    state: companyState,
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
