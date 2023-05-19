import "./navigation.scss";
import { Menu } from "primereact/menu";
import React from "react";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import {LocalStore} from "../../utils/storage.utils";

const Navbar = () => {
  const menu = React.useRef<Menu | any>(null);
  const [user, setUser] = React.useState<any>();
  React.useEffect(()=> {
    setUser(LocalStore.get('user'))
  }, [])
  let items = [
    {
      template: (item: any, options: any) => {
        return (
          <button
            onClick={(e) => options.onClick(e)}
            className={classNames(
              options.className,
              "w-full p-link flex align-items-center gap-2"
            )}
          >
            <div className="rounded-md bg-orange-300 w-10 h-10 flex items-center justify-center">
              <i className="pi pi-user text-white"></i>
            </div>
            <div className="flex flex-col align">
              <span className="font-semibold capitalize text-sm">{user?.username}</span>
              <span className="text-sm capitalize text-gray-400">{user?.role?.toLowerCase()}</span>
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
                <span className="truncate capitalize w-20 font-semibold tracking-wide leading-none">
                  {user?.username}
                </span>
                <span className="truncate capitalize w-20 text-gray-500 text-xs leading-none mt-1">
                  {user?.role?.toLowerCase()}
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
