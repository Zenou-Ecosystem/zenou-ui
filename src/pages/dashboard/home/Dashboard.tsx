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
import { Dropdown } from 'primereact/dropdown';

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
  const filters = [ {
    name: "General",
    code: "general"
  }, {
    name: "Par Impact",
    code: "impact"
  }, {
    name: "Par Nature de l'impact",
    code: "natureOfImpact"
  }, {
    name: "Par applicabilité",
    code: "applicable"
  } ]
  const [filterState, setFilterState] =React.useState(filters[0]);
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

      const countItemsBySector = (array:any) => {
        const counts = array.reduce((accumulator:any, item:any) => {
          const parent = item.parent_of_text;
          const sector = item.sectors_of_activity;

          sector.forEach((sectorItem:any) => {
            if (!accumulator[sectorItem]) {
              accumulator[sectorItem] = 0;
            }

            if (parent) {
              accumulator[sectorItem] += parent.length;
            }
          });

          return accumulator;
        }, {});

        return counts;
      };

      const countItems = (array:any, condition: Function) => {
        return array.reduce((accumulator:any, item:any) => {
          // hold the text analysis
          const textAnalysis = item?.text_analysis ?? [];

          // the sectors of activity
          const sector = item.sectors_of_activity;

          // loop through the sectors of activity
          sector.forEach((sectorItem:any) => {
            if (!accumulator[sectorItem]) {
              accumulator[sectorItem] = 0;
            }
            accumulator[sectorItem] += textAnalysis.filter(condition)?.length;
          });

          return accumulator;
        }, {});

      }

      const compliance = countItems(data, (x:any) => x?.compliant === true);

      const result = countItemsBySector(data);

      console.log(kpiData);

      const statisticsLawsBySectorOfActivity = {
        air: data.filter((x:any) => x.sectors_of_activity.includes("air"))?.length,
        terre: data?.filter((x:any) => x.sectors_of_activity.includes("land"))?.length,
        transport: data?.filter((x:any) => x.sectors_of_activity.includes("transport"))?.length,
        environnement: data?.filter((x:any) => x.sectors_of_activity.includes("environment"))?.length,
        eau: data?.filter((x:any) => x.sectors_of_activity.includes("water"))?.length,
        education: data?.filter((x:any) => x.sectors_of_activity.includes("education"))?.length,
        sante: data?.filter((x:any) => x.sectors_of_activity.includes("health"))?.length,
        agriculture: data?.filter((x:any) => x.sectors_of_activity.includes("agriculture"))?.length,
        business: data?.filter((x:any) => x.sectors_of_activity.includes("business"))?.length,
      }

      const LawsBySectorOfActivityParentOfText = {
        air: result?.air ?? 0,
        terre: result?.land ?? 0,
        transport: result?.transport ?? 0,
        environnement: result?.environment ?? 0,
        eau: result?.water ?? 0,
        education: result?.education ?? 0,
        sante: result?.health ?? 0,
        agriculture: result?.agriculture ?? 0,
        business: result?.business ?? 0,
      }

      const LawsBySectorOfActivityCompliance = {
        air: kpiData?.domains?.complaint?.air ?? 0,
        terre: kpiData?.domains?.complaint?.land ?? 0,
        transport: kpiData?.domains?.complaint?.transport ?? 0,
        environnement: kpiData?.domains?.complaint?.environment ?? 0,
        eau: kpiData?.domains?.complaint?.water ?? 0,
        education: kpiData?.domains?.complaint?.education ?? 0,
        sante: kpiData?.domains?.complaint?.health ?? 0,
        agriculture: kpiData?.domains?.complaint?.agriculture ?? 0,
        business: kpiData?.domains?.complaint?.business ?? 0,
      }

      const LawsBySectorOfActivityApplicable = {
        air: kpiData?.domains?.applicability?.air ?? 0,
        terre: kpiData?.domains?.applicability?.land ?? 0,
        transport: kpiData?.domains?.applicability?.transport ?? 0,
        environnement: kpiData?.domains?.applicability?.environment ?? 0,
        eau: kpiData?.domains?.applicability?.water ?? 0,
        education: kpiData?.domains?.applicability?.education ?? 0,
        sante: kpiData?.domains?.applicability?.health ?? 0,
        agriculture: kpiData?.domains?.applicability?.agriculture ?? 0,
        business: kpiData?.domains?.applicability?.business ?? 0,
      }

      const applicable = {
        labels: Object.keys(statisticsLawsBySectorOfActivity),
        datasets: [
          {
            type: 'bar',
            label: "Oui",
            data: Object.values(LawsBySectorOfActivityApplicable),
          },{
            type: 'bar',
            label: "Non",
            data: Object.values(countItems(data, (x:any) => x?.applicability === 'no')),
          },{
            type: 'bar',
            label: "Information",
            data: Object.values(countItems(data, (x:any) => x?.applicability === 'information')),
          }
        ]
      };

      const natureOfImpact = {
        labels: Object.keys(statisticsLawsBySectorOfActivity),
        datasets: [
          {
            type: 'bar',
            label: "Financier",
            data: Object.values(countItems(data, (x:any) => x?.nature_of_impact === 'financial')),
          },{
            type: 'bar',
            label: "Organisation",
            data: Object.values(countItems(data, (x:any) => x?.nature_of_impact === 'organisation')),
          },{
            type: 'bar',
            label: "Produit",
            data: Object.values(countItems(data, (x:any) => x?.nature_of_impact === 'products')),
          },{
            type: 'bar',
            label: "Image",
            data: Object.values(countItems(data, (x:any) => x?.nature_of_impact === 'image')),
          }
        ]
      };

      const impact = {
        labels: Object.keys(statisticsLawsBySectorOfActivity),
        datasets: [
          {
            type: 'bar',
            label: "Faible",
            data: Object.values(countItems(data, (x:any) => x?.impact === 'weak')),
            backgroundColor: Object.keys(statisticsLawsBySectorOfActivity).map(() =>'rgba(247,179,34,0.4)'),
          },{
            type: 'bar',
            label: "Moyen",
            data: Object.values(countItems(data, (x:any) => x?.impact === 'medium')),
            backgroundColor: Object.keys(statisticsLawsBySectorOfActivity).map(() =>'rgba(254,140,28,0.62)'),
          },{
            type: 'bar',
            label: "Majeur",
            data: Object.values(countItems(data, (x:any) => x?.impact === 'major')),
            backgroundColor: Object.keys(statisticsLawsBySectorOfActivity).map(() =>'rgba(232,97,3,0.91)'),
          },{
            type: 'bar',
            label: "Critique",
            data: Object.values(countItems(data, (x:any) => x?.impact === 'critical')),
            backgroundColor: Object.keys(statisticsLawsBySectorOfActivity).map(() =>'rgb(255,7,7)'),
          }
        ],
      };

      const generalLawData = {
        labels: Object.keys(statisticsLawsBySectorOfActivity),
        datasets: [
          {
            type: 'bar',
            label: "Secteur d'activiter",
            data: Object.values(statisticsLawsBySectorOfActivity),
          },{
            type: 'bar',
            label: "Nombre de texte par sectuer d'activiter",
            data: Object.values(LawsBySectorOfActivityParentOfText),
          },{
            type: 'bar',
            label: "Texte conforme par sectuer d'activiter",
            data: Object.values(LawsBySectorOfActivityCompliance),
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
        },
      };

      setChartData({ general: generalLawData, generalConformityAnalysis, analysisData, impact, natureOfImpact, applicable });
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
                          <span className="text-gray-700 text-center font-normal">Taux de lois</span>
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
                          <span className="text-gray-700 text-center font-normal">Taux des control</span>
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
                          <span className="text-gray-700 text-center font-normal">Taux des plan d'action</span>
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
                          <span className="text-gray-700 text-center font-normal">Taux d'entreprise enregistré</span>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='border my-4 rounded-md p-4'>
              <div className='flex items-center justify-between mb-3'>
                <h1
                  className="font-medium text-xl pl-3 mb-4"
                >
                  Loi par secteur d'activite
                </h1>
                <Dropdown value={filterState} size={2} onChange={(e) =>  setFilterState(e.value)
                } options={filters} optionLabel="name"
                          placeholder="Filtre par options" className="w-56" />
              </div>
              <Chart type="bar" data={chartData?.[filterState?.code]} options={{
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
                          <span className="text-gray-700 text-center font-normal">Taux de conformité</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-ful  border-b  py-6">
                    <div className="max-w-sm h-full">
                      <div className="max-w-xs h-full">
                        <div className='flex items-center w-full h-full justify-center flex-col'>
                          <h4 className="text-2xl leading-8 text-center text-gray-700 font-bold">{statisticsState?.totalConform}</h4>
                          <span className="text-gray-700 text-center font-normal">Total des lois conformes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full  py-6">
                    <div className="max-w-sm h-full">
                      <div className="max-w-xs h-full">
                        <div className='flex items-center w-full h-full justify-center flex-col'>
                          <h4 className="text-2xl leading-8 text-center text-gray-700 font-bold">{statisticsState?.totalAnalysed}</h4>
                          <span className="text-gray-700 text-center font-normal">Total des loi analyser</span>
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
