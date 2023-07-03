import "./navigation.scss";
import { Menu } from "primereact/menu";
import React, { useState } from 'react';
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import {LocalStore} from "../../utils/storage.utils";
import { AppUserActions } from '../../constants/user.constants';
import { can } from '../../utils/access-control.utils';
import Locale from '../../components/locale';
import { currentLanguageValue, translationService } from '../../services/translation.service';

const Navbar = () => {
  const menu = React.useRef<Menu | any>(null);
  const [user, setUser] = React.useState<any>(LocalStore.get('user'));
  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');

  React.useMemo(()=>currentLanguageValue.subscribe(setCurrentLanguage), [currentLanguage]);

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
    { label: translationService(currentLanguage,'DASHBOARD.SIDEBAR.NAVIGATION.PROFILE'), icon: "pi pi-fw pi-user" },
    { label: translationService(currentLanguage,'DASHBOARD.SIDEBAR.NAVIGATION.SETTINGS'), icon: "pi pi-fw pi-cog" },
    { separator: true },
    { label: translationService(currentLanguage,'DASHBOARD.SIDEBAR.NAVIGATION.LOGOUT'), icon: "pi pi-sign-out" },
  ];
  if(can(AppUserActions.VIEW_COMPANY)){
    items.splice(2, 0, { label: translationService(currentLanguage,'DASHBOARD.SIDEBAR.NAVIGATION.COMPANIES'), icon: "pi pi-building" })
  }
  return (
    <>
      <header className="header bg-white shadow-sm sticky top-0 z-50 border-b py-4 px-8">
        <div className="header-content flex items-center flex-row">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText placeholder={translationService(currentLanguage,'INPUT.SEARCH')} className="p-inputtext-sm" />
          </span>
          <div className="flex ml-auto">
            <Locale /> &nbsp; &nbsp; &nbsp;
            <a
              onClick={(e) => menu.current.toggle(e)}
              className="flex cursor-pointer flex-row items-center"
            >
              <Menu model={items} popup ref={menu} id="dropdown" />
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
    </>
  );
};

export default Navbar;
