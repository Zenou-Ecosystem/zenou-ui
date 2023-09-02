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
import { currentLanguageValue } from '../../../services/translation.service';
import { fetchControls } from '../../../services/control.service';
import { fetchActions } from '../../../services/actions.service';
import { fecthCompanies } from '../../../services/companies.service';
import { Chart } from 'primereact/chart';
import { LocalStore } from '../../../utils/storage.utils';
import { fetchAllKpis } from '../../../services/kpi.service';

function Dashboard() {
  const [laws, setLaws] = useState<ILaws[]>([]);
  const { state } = useAppContext();
  const { state: LawState } = useLawContext();
  const [actionPlans, setActionPlans] = React.useState([]);
  const [controlPlans, setControlPlans] = React.useState([]);
  const [companies, setCompanies] = React.useState([]);
  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');
  const [chartData, setChartData] = React.useState({}) as any;
  const [chartOptions, setChartOptions] = React.useState({});
  const [statisticsState, setStatisticsState] = React.useState<any>(null);

  useEffect(() => {
    (async () => {
      const res = await state;
      let data = res?.data;
      if (!data || data?.length < 1) {
        data = await fetchLaws();
      }
      setControlPlans(await fetchControls());
      setActionPlans(await fetchActions());
      setCompanies(await fecthCompanies());
      setLaws(data);
      const userRole = LocalStore.get('user');
      const kpiData = await fetchAllKpis(userRole?.role);

      setStatisticsState(kpiData);

      const statisticsLawsBySectorOfActivity = {
        air: data.filter((x:any) => x.sectors_of_activity.includes("air"))?.length,
        land: data?.filter((x:any) => x.sectors_of_activity.includes("land"))?.length,
        transport: data?.filter((x:any) => x.sectors_of_activity.includes("transport"))?.length,
        environment: data?.filter((x:any) => x.sectors_of_activity.includes("environment"))?.length,
        water: data?.filter((x:any) => x.sectors_of_activity.includes("water"))?.length,
        education: data?.filter((x:any) => x.sectors_of_activity.includes("education"))?.length,
        health: data?.filter((x:any) => x.sectors_of_activity.includes("health"))?.length,
        agriculture: data?.filter((x:any) => x.sectors_of_activity.includes("agriculture"))?.length,
        business: data?.filter((x:any) => x.sectors_of_activity.includes("business"))?.length,
      }

      const generalLawData = {
        labels: Object.keys(statisticsLawsBySectorOfActivity),
        datasets: [
          {
            label: "Secteur d'activiter",
            data: Object.values(statisticsLawsBySectorOfActivity),
          }
        ]
      }
      const analysisData = {
        labels: ["Poucentage analysé", 'Poucentage non-analysé'],
        datasets: [
          {
            data: [kpiData?.percentageAnalysed ?? 0, kpiData?.percentageNotAnalysed ?? 0],
          }
        ]
      }

      const generalConformityAnalysis = {
        labels: ["Poucentage comforme", 'Poucentage non-conforme'],
        datasets: [
          {
            data: [kpiData?.percentageConform ?? 0, kpiData?.percentageNotConform ?? 0],
          }
        ]
      }

      const options = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true
            }
          }
        }
      };

      setChartData({ generalLawData, generalConformityAnalysis, analysisData });
      setChartOptions(options);

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
                      <div className='flex items-center justify-center'>
                        <div>
                          <h4 className="text-2xl leading-8 text-center text-gray-700 font-bold">{laws?.length ?? 0}</h4>
                          <span className="text-gray-700 font-normal">Taux de lois</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/4 border-r">
                  <div className="max-w-sm  px-6">
                    <div className="max-w-xs">
                      <div className='flex items-center justify-center'>
                        <div>
                          <h4 className="text-2xl text-center leading-8 text-gray-700 font-bold">{controlPlans?.length ?? 0}</h4>
                          <span className="text-gray-700 font-normal">Taux des control</span>
                        </div>

                      </div>

                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/4 border-r">
                  <div className="max-w-sm  px-6">
                    <div className="max-w-xs">
                      <div className='flex items-center justify-center'>
                        <div>
                          <h4 className="text-2xl text-center leading-8 text-gray-700 font-bold">{actionPlans?.length ?? 0}</h4>
                          <span className="text-gray-700 font-normal">Taux des plan d'action</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/4">
                  <div className="max-w-sm  px-6">
                    <div className="max-w-xs">
                      <div className='flex items-center justify-center'>
                        <div>
                          <h4 className="text-2xl text-center leading-8 text-gray-700 font-bold">{companies?.length ?? 0}</h4>
                          <span className="text-gray-700 font-normal">Taux d'entreprise enregistré</span>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='border my-4 rounded-md p-4'>
              <h1
                className="font-medium text-xl pl-3 mb-4"
              >
                Loi par secteur d'activite
              </h1>
              <Chart type="bar" data={chartData?.generalLawData} options={{
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }} className="w-full" />
            </div>

            <div className='grid grid-cols-1 border my-4 rounded-md md:grid-cols-9 '>
              <div className='col-span-3 border-r p-4'>
                <h1
                  className="font-medium text-xl pl-3 mb-4"
                >
                  Statitique generale de Comformité
                </h1>
                <br/>
                <Chart type="pie" data={chartData?.generalConformityAnalysis} options={chartOptions} className="w-72" />
              </div>
              <div className='col-span-3 border-r p-4'>
                <h1
                  className="font-medium text-xl pl-3 mb-4"
                >
                  Statitique generale de analyse
                </h1>
                <br/>
                <Chart type="pie" data={chartData?.analysisData} options={chartOptions} className="w-72" />
              </div>
              <div className='col-span-3 border-r p-4'>
                <br/>
                <div className="flex justify-evenly h-full flex-col ">
                  <div className="w-full border-b py-6">
                    <div className="max-w-sm h-full">
                      <div className="max-w-xs h-full">
                        <div className='flex items-center w-full h-full justify-center flex-col'>
                          <h4 className="text-2xl leading-8 text-center text-gray-700 font-bold">{statisticsState?.complianceRate}</h4>
                          <span className="text-gray-700 font-normal">Taux de loi</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-ful  border-b  py-6">
                    <div className="max-w-sm h-full">
                      <div className="max-w-xs h-full">
                        <div className='flex items-center w-full h-full justify-center flex-col'>
                          <h4 className="text-2xl leading-8 text-center text-gray-700 font-bold">{statisticsState?.totalConform}</h4>
                          <span className="text-gray-700 font-normal">Taux de loi conforme</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full  py-6">
                    <div className="max-w-sm h-full">
                      <div className="max-w-xs h-full">
                        <div className='flex items-center w-full h-full justify-center flex-col'>
                          <h4 className="text-2xl leading-8 text-center text-gray-700 font-bold">{statisticsState?.totalAnalysed}</h4>
                          <span className="text-gray-700 font-normal">Taux de loi analyser</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="my-6 border rounded-md p-8">
              <div className=''>
                <h1
                  className="font-medium text-2xl"
                >
                  Quelques Lois
                </h1>
                <Datatable
                  data={laws?.slice(0, 5)}
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
                    Voir toute les lois
                  </NavLink>
                </button>
              </div>

            </div>

          </div>
        </section>
      </div>
    )
}

export default Dashboard
