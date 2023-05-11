import React from "react";
import { NavLink } from "react-router-dom";
import "./navigation.scss";
import { can } from "../../utils/access-control.utils";
import { AppUserActions } from "../../constants/user.constants";

function SidebarComponent() {
  return (
    <aside className="w-2/12 md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in">
      <h2 className="text-3xl pt-5 px-8 mb-6 pb-5 border-b border-gray-500 font-semibold">
        Zenou.
      </h2>

      <ul className="flex px-4 flex-col gap-3">
        <NavLink to="/dashboard/home" state={"home"} className="px-4">
          <li className="py-2 flex flex-wrap items-center gap-2 text-lg">
            <i className="pi pi-home"></i>
            <span>Home</span>
          </li>
        </NavLink>
        {!can(AppUserActions.VIEW_STATISTICS) ? null : (
          <NavLink to="/dashboard/stats" state={"statistics"} className="px-4">
            <li className="py-2 flex flex-wrap items-center gap-2 text-lg">
              <i className="pi pi-chart-bar"></i>
              <span>Statistics</span>
            </li>
          </NavLink>
        )}
        {!can(AppUserActions.VIEW_LAW) ? null : (
          <NavLink to="/dashboard/laws" state={"laws"} className="px-4">
            <li className="py-2 flex flex-wrap items-center gap-2 text-lg">
              <i className="pi pi-file-edit"></i>
              <span>Laws</span>
            </li>
          </NavLink>
        )}
        {!can(AppUserActions.VIEW_CONTROL) ? null : (
          <NavLink to="/dashboard/controls" state={"controls"} className="px-4">
            <li className="py-2 flex flex-wrap items-center gap-2 text-lg">
              <i className="pi pi-refresh"></i>
              <span>Controls</span>
            </li>
          </NavLink>
        )}
        {!can(AppUserActions.VIEW_ACTIONS) ? null : (
          <NavLink to="/dashboard/actions" state={"actions"} className="px-4">
            <li className="py-2 flex flex-wrap items-center gap-2 text-lg">
              <i className="pi pi-book"></i>
              <span>Actions</span>
            </li>
          </NavLink>
        )}
        {!can(AppUserActions.VIEW_COMPANY) ? null : (
          <NavLink to="/dashboard/companies" state={"company"} className="px-4">
            <li className="py-2 flex flex-wrap items-center gap-2 text-lg">
              <i className="pi pi-building"></i>
              <span>Companies</span>
            </li>
          </NavLink>
        )}
        {!can(AppUserActions.VIEW_PERSONNEL) ? null : (
          <NavLink
            to="/dashboard/personnel"
            state={"personnel"}
            className="px-4"
          >
            <li className="py-2 flex flex-wrap items-center gap-2 text-lg">
              <i className="pi pi-users"></i>
              <span>Employees</span>
            </li>
          </NavLink>
        )}
        {!can(AppUserActions.VIEW_SUBSCRIPTION) ? null : (
          <NavLink
            to="/dashboard/subscriptions"
            state={"subscriptions"}
            className="px-4"
          >
            <li className="py-2 flex flex-wrap items-center gap-2 text-lg">
              <i className="pi pi-file-edit"></i>
              <span>Subscriptions</span>
            </li>
          </NavLink>
        )}
        <NavLink to="/user/profile" state={"user"} className="px-4">
          <li className="py-2 flex flex-wrap items-center gap-2 text-lg">
            <i className="pi pi-cog"></i>
            <span>Settings</span>
          </li>
        </NavLink>
        <NavLink to="/user/logout" className="rounded-md px-4">
          <li className="py-2 flex flex-wrap items-center gap-2 text-lg">
            <i className="pi pi-sign-out"></i>
            <span>Log out</span>
          </li>
        </NavLink>
      </ul>
    </aside>
  );
}

export default SidebarComponent;
