import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import "./navigation.scss";
import { can } from "../../utils/access-control.utils";
import { AppUserActions } from "../../constants/user.constants";
import { currentLanguageValue, translationService } from '../../services/translation.service';

function SidebarComponent() {
  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');
  React.useMemo(()=>currentLanguageValue.subscribe(setCurrentLanguage), [currentLanguage])

  return (
    <aside className=" md:shadow transform -translate-x-full md:translate-x-0 transition-transform fixed h-screen top-0 w-2/12 z-50 duration-150 ease-in">
      <h2 className="text-3xl pt-5 px-8 mb-6 pb-5 border-b border-gray-500 font-semibold">
        Zenou
      </h2>

      <ul className="flex px-4 flex-col gap-3">
        <NavLink to="/dashboard/home" state={"home"} className="px-4">
          <li className="py-2 flex flex-wrap items-center gap-2 text-lg">
            <i className="pi pi-home"></i>
            <span>{translationService(currentLanguage,'DASHBOARD.SIDEBAR.NAVIGATION.HOME')}</span>
          </li>
        </NavLink>
        {!can(AppUserActions.VIEW_STATISTICS) ? null : (
          <NavLink to="/dashboard/stats" state={"statistics"} className="px-4">
            <li className="py-2 flex flex-wrap items-center gap-2 text-lg">
              <i className="pi pi-chart-bar"></i>
              <span>{translationService(currentLanguage,'DASHBOARD.SIDEBAR.NAVIGATION.STATISTICS')}</span>
            </li>
          </NavLink>
        )}
        {!can(AppUserActions.VIEW_LAW) ? null : (
          <NavLink to="/dashboard/laws" state={"laws"} className="px-4">
            <li className="py-2 flex flex-wrap items-center gap-2 text-lg">
              <i className="pi pi-file-edit"></i>
              <span>{translationService(currentLanguage,'DASHBOARD.SIDEBAR.NAVIGATION.LAWS')}</span>
            </li>
          </NavLink>
        )}
        {!can(AppUserActions.VIEW_CONTROL) ? null : (
          <NavLink to="/dashboard/controls" state={"controls"} className="px-4">
            <li className="py-2 flex flex-wrap items-center gap-2 text-lg">
              <i className="pi pi-refresh"></i>
              <span>{translationService(currentLanguage,'DASHBOARD.SIDEBAR.NAVIGATION.CONTROLS')}</span>
            </li>
          </NavLink>
        )}
        {!can(AppUserActions.VIEW_ACTIONS) ? null : (
          <NavLink to="/dashboard/actions" state={"actions"} className="px-4">
            <li className="py-2 flex flex-wrap items-center gap-2 text-lg">
              <i className="pi pi-book"></i>
              <span>{translationService(currentLanguage,'DASHBOARD.SIDEBAR.NAVIGATION.ACTIONS')}</span>
            </li>
          </NavLink>
        )}
        {!can(AppUserActions.VIEW_COMPANY) ? null : (
          <NavLink to="/dashboard/companies" state={"company"} className="px-4">
            <li className="py-2 flex flex-wrap items-center gap-2 text-lg">
              <i className="pi pi-building"></i>
              <span>{translationService(currentLanguage,'DASHBOARD.SIDEBAR.NAVIGATION.COMPANIES')}</span>
            </li>
          </NavLink>
        )}
        {/*{!can(AppUserActions.VIEW_PERSONNEL) ? null : (*/}
        {/*  <NavLink*/}
        {/*    to="/dashboard/personnel"*/}
        {/*    state={"personnel"}*/}
        {/*    className="px-4"*/}
        {/*  >*/}
        {/*    <li className="py-2 flex flex-wrap items-center gap-2 text-lg">*/}
        {/*      <i className="pi pi-users"></i>*/}
        {/*      <span>{translationService(currentLanguage,'DASHBOARD.SIDEBAR.NAVIGATION.EMPLOYEES')}</span>*/}
        {/*    </li>*/}
        {/*  </NavLink>*/}
        {/*)}*/}
        {/*{!can(AppUserActions.VIEW_SUBSCRIPTION) ? null : (
          <NavLink
            to="/dashboard/subscriptions"
            state={"subscriptions"}
            className="px-4"
          >
            <li className="py-2 flex flex-wrap items-center gap-2 text-lg">
              <i className="pi pi-file-edit"></i>
              <span>{translationService(currentLanguage,'DASHBOARD.SIDEBAR.NAVIGATION.SUBSCRIPTION')}</span>
            </li>
          </NavLink>
        )}*/}
        {/*<NavLink to="/user/profile" state={"user"} className="px-4">*/}
        {/*  <li className="py-2 flex flex-wrap items-center gap-2 text-lg">*/}
        {/*    <i className="pi pi-cog"></i>*/}
        {/*    <span>{translationService(currentLanguage,'DASHBOARD.SIDEBAR.NAVIGATION.SETTINGS')}</span>*/}
        {/*  </li>*/}
        {/*</NavLink>*/}
      </ul>
          <li className="py-3 px-4 fixed bottom-10 lef-0 w-full flex flex-wrap bg-red-500 gap-2">
            <NavLink to="/user/logout" className="w-full flex gap-2 items-center">
                <i className="pi pi-sign-out"></i>
                <span>{translationService(currentLanguage,'DASHBOARD.SIDEBAR.NAVIGATION.LOGOUT')}</span>
            </NavLink>
          </li>
    </aside>
  );
}

export default SidebarComponent;
