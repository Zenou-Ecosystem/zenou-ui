import React, { useEffect, useState } from 'react';
import { LawActionTypes } from '../../../store/action-types/laws.actions';
import { LawContext } from '../../../contexts/LawContext';
import { AppUserActions } from '../../../constants/user.constants';
import Datatable from '../../../core/table/Datatable';
import { ILaws } from '../../../interfaces/laws.interface';
import { fetchLaws } from '../../../services/laws.service';
import useAppContext from '../../../hooks/useAppContext.hooks';
import useLawContext from '../../../hooks/useLawContext';
import { NavLink } from 'react-router-dom';
import { currentLanguageValue, translationService } from '../../../services/translation.service';
import LineChartComponent from '../../../core/charts/Line/SimpleLineChart';
import SimpleBarChartComponent from '../../../core/charts/Bar/SimpleBarChart';

function Dashboard() {
  const [laws, setLaws] = useState<ILaws[]>([]);
  const { state } = useAppContext();
  const { state: LawState } = useLawContext();
  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');

  useEffect(() => {
    (async () => {
      const res = await state;
      let data = res?.data;
      if (!data || data?.length < 1) {
        data = await fetchLaws();
      }
      setLaws(data);
    })();

    (async () => {
      const resolvedLawState = await LawState;
      if (resolvedLawState.hasCreated) {
        console.log("Law state changed => ", resolvedLawState);
        // setVisible(false);
      }
    })();
    currentLanguageValue.subscribe(setCurrentLanguage);
  }, [state, LawState, currentLanguage]);

    return (
      <div>
        <section className="py-3">
          <div className="container px-4 mx-auto">
          <div className='mb-10'>
            <h2 className='text-3xl py-2 font-medium'>Welcome back, Admin</h2>
            <p className='text-gray-400 font-normal'>An overview of the system's information</p>
          </div>
            <div className="mb-6">
              <div className="flex flex-wrap border rounded-md py-8">
                <div className="w-full md:w-1/2 lg:w-1/4 border-r">
                  <div className="max-w-sm  px-6">
                    <div className="max-w-xs">
                      <div className='flex items-start justify-between'>
                        <div>
                          <h4 className="text-2xl leading-8 text-gray-700 font-bold">89,235</h4>
                          <span className="text-gray-700 font-normal">Total laws</span>
                        </div>
                          <div
                            className="flex w-10 h-10 shadow-lg  items-center justify-center text-blue-700 rounded-lg">
                            <i className='pi pi-book'></i>
                          </div>
                      </div>
                      <div className="flex flex-wrap mt-4 items-center justify-start ">
                        <div className="w-auto p-1">
                          <small
                            className="inline-block py-0.5 px-2.5 text-green-500 border border-green-300 font-medium bg-green-100 rounded-full">1,0%</small>
                        </div>
                        <div className="w-auto p-1">
                          <span className="font-normal text-gray-500 font-medium">Since last month</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/4 border-r">
                  <div className="max-w-sm  px-6">
                    <div className="max-w-xs">
                      <div className='flex items-start justify-between'>
                        <div>
                          <h4 className="text-2xl leading-8 text-gray-700 font-bold">89,235</h4>
                          <span className="text-gray-700 font-normal">Total laws</span>
                        </div>
                        <div
                          className="flex w-10 h-10 shadow-lg  items-center justify-center text-blue-700 rounded-lg">
                          <i className='pi pi-book'></i>
                        </div>
                      </div>
                      <div className="flex flex-wrap mt-4 items-center justify-start ">
                        <div className="w-auto p-1">
                          <small
                            className="inline-block py-0.5 px-2.5 text-green-500 border border-green-300 font-medium bg-green-100 rounded-full">1,0%</small>
                        </div>
                        <div className="w-auto p-1">
                          <span className="font-normal text-gray-500 font-medium">Since last month</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/4 border-r">
                  <div className="max-w-sm  px-6">
                    <div className="max-w-xs">
                      <div className='flex items-start justify-between'>
                        <div>
                          <h4 className="text-2xl leading-8 text-gray-700 font-bold">89,235</h4>
                          <span className="text-gray-700 font-normal">Total laws</span>
                        </div>
                        <div
                          className="flex w-10 h-10 shadow-lg  items-center justify-center text-blue-700 rounded-lg">
                          <i className='pi pi-book'></i>
                        </div>
                      </div>
                      <div className="flex flex-wrap mt-4 items-center justify-start ">
                        <div className="w-auto p-1">
                          <small
                            className="inline-block py-0.5 px-2.5 text-green-500 border border-green-300 font-medium bg-green-100 rounded-full">1,0%</small>
                        </div>
                        <div className="w-auto p-1">
                          <span className="font-normal text-gray-500 font-medium">Since last month</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/4">
                  <div className="max-w-sm  px-6">
                    <div className="max-w-xs">
                      <div className='flex items-start justify-between'>
                        <div>
                          <h4 className="text-2xl leading-8 text-gray-700 font-bold">89,235</h4>
                          <span className="text-gray-700 font-normal">Total laws</span>
                        </div>
                        <div
                          className="flex w-10 h-10 shadow-lg  items-center justify-center text-blue-700 rounded-lg">
                          <i className='pi pi-book'></i>
                        </div>
                      </div>
                      <div className="flex flex-wrap mt-4 items-center justify-start ">
                        <div className="w-auto p-1">
                          <small
                            className="inline-block py-0.5 px-2.5 text-green-500 border border-green-300 font-medium bg-green-100 rounded-full">1,0%</small>
                        </div>
                        <div className="w-auto p-1">
                          <span className="font-normal text-gray-500 font-medium">Since last month</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='grid grid-cols-1 mt-10 md:grid-cols-9 gap-6'>
              <div className='col-span-6 border rounded-md p-4'>
                <h1
                  className="font-medium text-xl pl-3 mb-4"
                >
                  Laws Analytics
                </h1>
                <LineChartComponent />
              </div>
              <div className='col-span-3 border rounded-md p-4'>
                <h1
                  className="font-medium text-xl pl-3 mb-4"
                >
                  Laws Analytics
                </h1>
                <br/>
                <SimpleBarChartComponent />
              </div>
            </div>
            <div className="mt-10 border rounded-md p-8">
              <div className=''>
                <h1
                  className="font-medium text-2xl"
                >
                  Laws
                </h1>
                <Datatable
                  data={laws?.slice(0, 7)}
                  noPagination
                  fields={[
                    "title_of_text",
                    "type_of_text",
                    "date_of_issue",
                    "applicability",
                    "compliant",
                  ]}
                  actionTypes={LawActionTypes}
                  context={LawContext}
                  translationKey={'LAW.ADD.FORM'}
                  accessControls={{
                    EDIT: AppUserActions.EDIT_LAW,
                    DELETE: AppUserActions.DELETE_LAW,
                    VIEW: AppUserActions.VIEW_LAW,
                  }}
                />
                <button className="bg-yellow-700 text-white rounded-md text-sm px-6 py-2.5">
                  <NavLink to={'/dashboard/laws'}>
                    See all laws
                  </NavLink>
                </button>
              </div>
              <div className='col-span-5'>
                {/*<LineChartComponent />*/}
              </div>
              <div className='col-span-3'>
                {/*<AreaChartComponent />*/}
                {/*<CustomBarChartComponent />*/}
              </div>
            </div>

          </div>
        </section>
      </div>
    )
}

export default Dashboard
