import React, { useEffect } from "react";
import "./dashboard.scss";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../navigation/Navbar";
import { LocalStore } from "../../utils/storage.utils";
import SidebarComponent from "../navigation/Sidebar";
import ModalComponent from '../../core/shared/modal';
import { useDispatch, useSelector } from 'react-redux';
import { ActionsActionTypes } from '../../store/action-types/action.actions';
import httpHandlerService from '../../services/httpHandler.service';
import { LawActionTypes } from '../../store/action-types/laws.actions';
import { CompanyActionTypes } from '../../store/action-types/company.actions';
import { ControlActionTypes } from '../../store/action-types/control.actions';
import { initialState } from '../../store/state';
import ProgressLoader from '../../core/shared/loader/Progress';

function DashboardHome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const modal = useSelector((state: typeof initialState) => state.modal);
  const loader = useSelector((state: typeof initialState) => state.loader);
  const user = useSelector((state: typeof initialState) => state.user);

  if (!user?.access_token) {
    navigate("/", { replace: true });
  }

  useEffect(() => {
      dispatch(
        httpHandlerService({
        endpoint: 'actions',
        method: 'GET'
      }, ActionsActionTypes.FETCH_ACTIONS) as any
    );
    dispatch(
        httpHandlerService({
          endpoint: 'law',
          method: 'GET'
        }, LawActionTypes.FETCH_LAWS) as any
    );
    dispatch(
      httpHandlerService({
        endpoint: 'company',
        method: 'GET'
      }, CompanyActionTypes.FETCH_COMPANIES) as any
    );
    dispatch(
      httpHandlerService({
        endpoint: 'controls',
        method: 'GET'
      }, ControlActionTypes.FETCH_CONTROLS) as any
    );

  }, [dispatch])


  function HandleLoader() {
    if(loader && loader.type === "PROGRESS" && loader.isOpened) {
      return <ProgressLoader />
    }else {
      return <div className="flex flex-col flex-grow p-8">
        <Outlet />
      </div>
    }
  }

  function HandleModal() {
    if(modal) {
     return <ModalComponent
        actions={modal.actions}
        severity={modal.severity}
        bodyText={
          modal.bodyText
        } headerText={
        modal.headerText
      }/>
    }else {
      return <></>
    }
  }
  return (
    <main>
      <HandleModal />
      <section className="flex flex-row min-h-screen">
        <SidebarComponent />
        <section className="w-10/12 flex flex-col flex-grow ml-[16.675%]  transition-all duration-150 ease-in">
          <Navbar />
          <HandleLoader />
        </section>
      </section>
    </main>
  );
}

export default DashboardHome;
