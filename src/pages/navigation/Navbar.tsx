import "./navigation.scss";
import { Menu } from "primereact/menu";
import React, { useState } from 'react';
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { AppUserActions } from '../../constants/user.constants';
import { can } from '../../utils/access-control.utils';
import Locale from '../../components/locale';
import { currentLanguageValue, translationService } from '../../services/translation.service';
import { useNavigate } from 'react-router-dom';
import { initialState } from '../../store/state';
import { useSelector, useDispatch } from "react-redux";
import { IUserActions, UserActionTypes } from '../../store/action-types/user.actions';
import { Dispatch } from 'redux';

const Navbar = () => {
  const menu = React.useRef<Menu | any>(null);
  const user = useSelector((state: typeof initialState) => state.user);
  const dispatch = useDispatch<Dispatch<IUserActions>>();

  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');
  const navigate = useNavigate();

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
              <span className="text-sm capitalize text-gray-400">{user?.role?.toLowerCase().replaceAll('_', ' ')}</span>
            </div>
          </button>
        );
      },
    },
    { separator: true },
    // { label: translationService(currentLanguage,'DASHBOARD.SIDEBAR.NAVIGATION.PROFILE'), icon: "pi pi-fw pi-user", command:() => navigate('/user/profile')  },
    // { label: translationService(currentLanguage,'DASHBOARD.SIDEBAR.NAVIGATION.SETTINGS'), icon: "pi pi-fw pi-cog",  command:() => navigate('/user/profile')  },
    { separator: true },
    { label: translationService(currentLanguage,'DASHBOARD.SIDEBAR.NAVIGATION.LOGOUT'), icon: "pi pi-sign-out",  command:() => {
        dispatch({type: UserActionTypes.UN_AUTHENTICATE_USER});
        navigate('/');
      } },
  ];
  if(can(AppUserActions.VIEW_COMPANY)){
    items.splice(2, 0, { label: translationService(currentLanguage,'DASHBOARD.SIDEBAR.NAVIGATION.COMPANIES'), icon: "pi pi-building",  command:() => navigate('/dashboard/companies')  })
  }
  return (
    <>
      <header className="header md:w-[84%] w-full right-0 bg-white shadow-sm fixed top-0 z-50 border-b py-4 px-4 md:px-8">
        <div className="header-content flex items-center flex-row">
          <div className='flex gap-4'>
            <button onClick={(e) => {
              e.preventDefault();
            }}> <i className='pi pi-arrow-left'></i> </button>

            <button onClick={(e) => {
              e.preventDefault();
            }}> <i className='pi pi-arrow-right'></i></button>

          </div>

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
                  {user?.role?.toLowerCase().replaceAll('_', ' ')}
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
