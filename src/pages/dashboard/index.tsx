import React, { useEffect } from "react";
import "./dashboard.scss";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../navigation/Navbar";
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
import { StatisticsActions } from '../../store/action-types/statistics.actions';

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
    dispatch(
      httpHandlerService({
        endpoint: `law/summary/${user?.role}`,
        method: 'GET'
      }, StatisticsActions.FETCH_STATISTICS) as any
    );
  }, [dispatch]);

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
      <section className="flex flex-col md:flex-row min-h-screen">
          <Navbar />
          <SidebarComponent />
        <div className="w-full md:w-10/12 flex flex-col flex-grow w-full overflow-hidden  md:ml-[17%] mt-28 md:mt-12 p-2 md:p-8">
          { loader && loader.type === "PROGRESS" && loader.isOpened ? <ProgressLoader /> : <Outlet />}
        </div>
        {/*<section className="">*/}
        {/*</section>*/}
      </section>
    </main>
  );
}

export default DashboardHome;
