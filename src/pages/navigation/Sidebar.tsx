import React from "react";
import {
  FaHouseUser,
  FaRegChartBar,
  FaUsers,
  FaDirections,
  FaCheckDouble,
  FaBook,
  FaSignOutAlt,
  FaCogs,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./navigation.scss";
import { can } from "../../utils/access-control.utils";
import { AppUserActions } from "../../constants/user.constants";

function Sidebar() {
  return (
    <section className="sidebar w-full h-full pt-5">
      <ul className="flex flex-col justify-center items-center gap-3">
        <li className="py-2 w-1/2">
          <NavLink
            to="/dashboard/home"
            state={"home"}
            className="flex flex-wrap items-center gap-2 text-lg"
          >
            <FaHouseUser />
            <span>Home</span>
          </NavLink>
        </li>
        {!can(AppUserActions.VIEW_STATISTICS) ? null : (
          <li className="py-2 w-1/2">
            <NavLink
              to="/dashboard/stats"
              state={"statistics"}
              className="flex flex-wrap items-center gap-2 text-lg"
            >
              <FaRegChartBar />
              <span>Statistics</span>
            </NavLink>
          </li>
        )}
        <li className="py-2 w-1/2">
          <NavLink
            to="/dashboard/laws"
            state={"laws"}
            className="flex flex-wrap items-center gap-2 text-lg"
          >
            <FaDirections />
            <span>Laws</span>
          </NavLink>
        </li>
        <li className="py-2 w-1/2">
          <NavLink
            to="/dashboard/controls"
            state={"controls"}
            className="flex flex-wrap items-center gap-2 text-lg"
          >
            <FaCheckDouble />
            <span>Controls</span>
          </NavLink>
        </li>
        <li className="py-2 w-1/2">
          <NavLink
            to="/dashboard/actions"
            state={"actions"}
            className="flex flex-wrap items-center gap-2 text-lg"
          >
            <FaBook />
            <span>Actions</span>
          </NavLink>
        </li>
        {can(AppUserActions.VIEW_COMPANY) ? null : (
          <li className="py-2 w-1/2">
            <NavLink
              to="/dashboard/companies"
              state={"company"}
              className="flex flex-wrap items-center gap-2 text-lg"
            >
              <FaUsers />
              <span>Companies</span>
            </NavLink>
          </li>
        )}
        {!can(AppUserActions.VIEW_SUBSCRIPTION) ? null : (
          <li className="py-2 w-1/2">
            <NavLink
              to="/dashboard/subscriptions"
              state={"subscriptions"}
              className="flex flex-wrap items-center gap-2 text-lg"
            >
              <FaFileInvoiceDollar />
              <span>Subscriptions</span>
            </NavLink>
          </li>
        )}
        <li className="py-2 w-1/2">
          <NavLink
            to="/user/profile"
            state={"user"}
            className="flex flex-wrap items-center gap-2 text-lg"
          >
            <FaCogs />
            <span>Settings</span>
          </NavLink>
        </li>
        <li className="py-2 w-1/2">
          <NavLink
            to="/user/logout"
            className="flex flex-wrap items-center gap-2 text-lg"
          >
            <FaSignOutAlt />
            <span>Log out</span>
          </NavLink>
        </li>
      </ul>
    </section>
  );
}

export default Sidebar;
