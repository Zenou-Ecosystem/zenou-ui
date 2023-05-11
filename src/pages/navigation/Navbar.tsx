import { NavLink } from "react-router-dom";
import Search from "../../components/filter/Search";
import "./navigation.scss";
import { can } from "../../utils/access-control.utils";
import { AppUserActions } from "../../constants/user.constants";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import React from "react";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Avatar } from "primereact/avatar";

const Navbar = () => {
  const menu = React.useRef<Menu | any>(null);
  let items = [
    {
      template: (item: any, options: any) => {
        return (
          <button
            onClick={(e) => options.onClick(e)}
            className={classNames(
              options.className,
              "w-full p-link flex align-items-center"
            )}
          >
            <Avatar label="P" className="mr-2" size="normal" />
            <div className="flex flex-col align">
              <span className="font-semibold text-sm">Amy Elsner</span>
              <span className="text-sm text-gray-400">Agent</span>
            </div>
          </button>
        );
      },
    },
    { separator: true },
    { label: "Companies", icon: "pi pi-building" },
    { label: "Profile", icon: "pi pi-fw pi-user" },
    { label: "Settings", icon: "pi pi-fw pi-cog" },
    { separator: true },
    { label: "Logout", icon: "pi pi-sign-out" },
  ];
  return (
    <>
      <header className="header bg-white shadow py-4 px-8">
        <div className="header-content flex items-center flex-row">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText placeholder="Search" className="p-inputtext-sm" />
          </span>
          <div className="flex ml-auto">
            <a
              onClick={(e) => menu.current.toggle(e)}
              className="flex cursor-pointer flex-row items-center"
            >
              <Menu model={items} popup ref={menu} />
              <div className="rounded-md bg-orange-300 w-10 h-10 flex items-center justify-center">
                <i className="pi pi-user text-white"></i>
              </div>
              <span className="flex flex-col ml-2">
                <span className="truncate w-20 font-semibold tracking-wide leading-none">
                  John Doe
                </span>
                <span className="truncate w-20 text-gray-500 text-xs leading-none mt-1">
                  Manager
                </span>
              </span>
            </a>
          </div>
        </div>
      </header>
      {/*<nav className="navbar text-grayColor w-full pt-2 font-bold capitalize">*/}
      {/*    <ul className="flex justify-around items-center gap-3">*/}
      {/*        <li className="p-2 w-1/2">*/}
      {/*            <Search />*/}
      {/*        </li>*/}
      {/*        {*/}
      {/*            !can(AppUserActions.VIEW_COMPANY) ? null :*/}
      {/*                <li>*/}
      {/*                    <NavLink end to="/dashboard/companies">Companies</NavLink>*/}
      {/*                </li>*/}
      {/*        }*/}
      {/*        <li>*/}
      {/*            <NavLink end to="/user/profile">profile</NavLink>*/}
      {/*        </li>*/}
      {/*        <li>*/}
      {/*            <NavLink end to="/user/logout">Log out</NavLink>*/}
      {/*        </li>*/}
      {/*    </ul>*/}
      {/*</nav>*/}
    </>
  );
};

export default Navbar;
