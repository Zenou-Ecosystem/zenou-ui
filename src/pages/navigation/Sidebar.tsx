import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import "./navigation.scss";
import { can } from "../../utils/access-control.utils";
import { AppUserActions } from "../../constants/user.constants";
import { currentLanguageValue, translationService } from '../../services/translation.service';
import { Dispatch } from 'redux';
import { IUserActions, UserActionTypes } from '../../store/action-types/user.actions';
import {useDispatch} from "react-redux";

function SidebarComponent() {
  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch<IUserActions>>();

  React.useMemo(()=>currentLanguageValue.subscribe(setCurrentLanguage), []);

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({type: UserActionTypes.UN_AUTHENTICATE_USER});
    navigate('/');
  }

  return (
    <aside className="md:shadow fixed h-max md:h-screen w-full overflow-auto md:overflow-hidden top-[4.5rem] md:top-0 md:w-2/12 z-50">
      <h2 className="text-3xl md:block hidden pt-5 px-8 mb-6 pb-5 border-b border-gray-500 font-semibold">
        Zenou
      </h2>

      <ul className="flex px-4 md:flex-col md:overflow-x-hidden overflow-x-scroll gap-3">
        <NavLink to="/dashboard/home" state={"home"} className="px-4">
          <li className="py-2 flex md:flex-wrap md:w-auto w-max items-center gap-2 md:text-lg">
            <i className="pi pi-home"></i>
            <span>{translationService(currentLanguage,'DASHBOARD.SIDEBAR.NAVIGATION.HOME')}</span>
          </li>
        </NavLink>
        {!can(AppUserActions.VIEW_STATISTICS) ? null : (
          <NavLink to="/dashboard/stats" state={"statistics"} className="px-4">
            <li className="py-2 flex md:flex-wrap md:w-auto w-max items-center gap-2 md:text-lg">
              <i className="pi pi-chart-bar"></i>
              <span>{translationService(currentLanguage,'DASHBOARD.SIDEBAR.NAVIGATION.STATISTICS')}</span>
            </li>
          </NavLink>
        )}
        {!can(AppUserActions.VIEW_LAW) ? null : (
          <NavLink to="/dashboard/laws" state={"laws"} className="px-4">
            <li className="py-2 flex md:flex-wrap md:w-auto w-max items-center gap-2 md:text-lg">
              <i className="pi pi-file-edit"></i>
              <span>{translationService(currentLanguage,'DASHBOARD.SIDEBAR.NAVIGATION.LAWS')}</span>
            </li>
          </NavLink>
        )}
        {!can(AppUserActions.VIEW_CONTROL) ? null : (
          <NavLink to="/dashboard/controls" state={"controls"} className="px-4">
            <li className="py-2 flex md:flex-wrap md:w-auto w-max items-center gap-2 md:text-lg">
              <i className="pi pi-refresh"></i>
              <span>{translationService(currentLanguage,'DASHBOARD.SIDEBAR.NAVIGATION.CONTROLS')}</span>
            </li>
          </NavLink>
        )}
        {!can(AppUserActions.VIEW_ACTIONS) ? null : (
          <NavLink to="/dashboard/actions" state={"actions"} className="px-4">
            <li className="py-2 flex md:flex-wrap md:w-auto w-max items-center gap-2 text-lg">
              <i className="pi pi-book"></i>
              <span>{translationService(currentLanguage,'DASHBOARD.SIDEBAR.NAVIGATION.ACTIONS')}</span>
            </li>
          </NavLink>
        )}
        {!can(AppUserActions.VIEW_COMPANY) ? null : (
          <NavLink to="/dashboard/companies" state={"company"} className="px-4">
            <li className="py-2 flex md:flex-wrap md:w-auto w-max items-center gap-2 md:text-lg">
              <i className="pi pi-building"></i>
              <span>{translationService(currentLanguage,'DASHBOARD.SIDEBAR.NAVIGATION.COMPANIES')}</span>
            </li>
          </NavLink>
        )}
          <li className="py-3 px-4 relative w-max md:fixed md:bottom-10 md:left-0 md:w-2/12 flex md:flex-wrap bg-red-500 gap-2">
            <button onClick={handleSignOut} className="w-full flex w-max md:w-auto gap-2 items-center">
                <i className="pi pi-sign-out"></i>
                <span>{translationService(currentLanguage,'DASHBOARD.SIDEBAR.NAVIGATION.LOGOUT')}</span>
            </button>
          </li>
      </ul>
    </aside>
  );
}

export default SidebarComponent;
