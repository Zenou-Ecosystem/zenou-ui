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
            <div className="mb-6">
              <div className="flex flex-wrap -mx-3 -mb-6">
                <div className="w-full md:w-1/2 lg:w-1/4 px-3 mb-6">
                  <div className="max-w-sm mx-auto py-8 px-6 bg-primary rounded-lg">
                    <div className="max-w-xs mx-auto text-center">
                      <div
                        className="flex mx-auto w-12 h-12 mb-4 items-center justify-center bg-gray-200 bg-opacity-20 text-gray-100 rounded-xl">
                        <i className='pi pi-book'></i>
                      </div>
                      <span className="text-gray-300 font-normal">Total laws</span>
                      <h4 className="text-2xl leading-8 text-gray-100 font-semibold mb-4">$28K</h4>
                      <div className="flex flex-wrap items-center justify-center -m-1">
                        <div className="w-auto p-1">
                          <span
                            className="inline-block py-1 px-2 text-xs text-green-500 border border-green-300 font-medium bg-teal-900 rounded-full">1,0%</span>
                        </div>
                        <div className="w-auto p-1">
                          <span className="text-xs text-gray-300 font-medium">Since last month</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/4 px-3 mb-6">
                  <div className="max-w-sm mx-auto py-8 px-6 bg-primary rounded-lg">
                    <div className="max-w-xs mx-auto text-center">
                      <div
                        className="flex mx-auto w-12 h-12 mb-4 items-center justify-center bg-gray-200 bg-opacity-20 text-gray-100 rounded-xl">
                        <i className='pi pi-building'></i>
                      </div>
                      <span className="text-gray-300 font-normal">Total companies</span>
                      <h4 className="text-2xl leading-8 text-gray-100 font-semibold mb-4">128K</h4>
                      <div className="flex flex-wrap items-center justify-center -m-1">
                        <div className="w-auto p-1">
                          <span
                            className="inline-block py-1 px-2 text-xs text-green-500 border border-green-300 font-medium bg-teal-900 rounded-full">1,0%</span>
                        </div>
                        <div className="w-auto p-1">
                          <span className="text-xs text-gray-300 font-medium">Since last month</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/4 px-3 mb-6">
                  <div className="max-w-sm mx-auto py-8 px-6 bg-primary rounded-lg">
                    <div className="max-w-xs mx-auto text-center">
                      <div
                        className="flex mx-auto w-12 h-12 mb-4 items-center justify-center bg-gray-200 bg-opacity-20 text-gray-100 rounded-xl">
                        <i className='pi pi-save'></i>
                      </div>
                      <span className="text-gray-300 font-normal">Percentage subscriptions</span>
                      <h4 className="text-2xl leading-8 text-gray-100 font-semibold mb-4">20%</h4>
                      <div className="flex flex-wrap items-center justify-center -m-1">
                        <div className="w-auto p-1">
                          <span
                            className="inline-block py-1 px-2 text-xs text-green-500 border border-green-300 font-medium bg-teal-900 rounded-full">1,0%</span>
                        </div>
                        <div className="w-auto p-1">
                          <span className="text-xs text-gray-300 font-medium">Since last month</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/4 px-3 mb-6">
                  <div className="max-w-sm mx-auto py-8 px-6 bg-primary rounded-lg">
                    <div className="max-w-xs mx-auto text-center">
                      <div
                        className="flex mx-auto w-12 h-12 mb-4 items-center justify-center bg-gray-200 bg-opacity-20 text-gray-100 rounded-xl">
                        <i className='pi pi-users'></i>
                      </div>
                      <span className="text-gray-300 font-normal">Total users</span>
                      <h4 className="text-2xl leading-8 text-gray-100 font-semibold mb-4">20K</h4>
                      <div className="flex flex-wrap items-center justify-center -m-1">
                        <div className="w-auto p-1">
                          <span
                            className="inline-block py-1 px-2 text-xs text-green-500 border border-green-300 font-medium bg-teal-900 rounded-full">1,0%</span>
                        </div>
                        <div className="w-auto p-1">
                          <span className="text-xs text-gray-300 font-medium">Since last month</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 mt-10 md:grid-cols-8 gap-6">
              <div className='col-span-8'>
                <h1
                  className="font-medium text-2xl"
                >
                  Laws
                </h1>
                <p className="text-gray-500 font-light">This is an overview of the laws exisitng in the system</p>
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
