import React from 'react';
import { LawActionTypes } from '../../../store/action-types/laws.actions';
import { LawContext } from '../../../contexts/LawContext';
import { AppUserActions } from '../../../constants/user.constants';
import Datatable from '../../../core/table/Datatable';
import { NavLink } from 'react-router-dom';
import { currentLanguageValue, translationService } from '../../../services/translation.service';
import { Chart } from 'primereact/chart';
import { Dropdown } from 'primereact/dropdown';
import { initialState } from '../../../store/state';
import { useSelector } from "react-redux";

export default function Dashboard() {
  const laws = useSelector((state: typeof initialState) => state.laws);
  const statisticsState = useSelector((state: typeof initialState) => state.statistics);
  const controlPlans = useSelector((state: typeof initialState) => state.controls);
  const actionPlans = useSelector((state: typeof initialState) => state.actions);
  const companies = useSelector((state: typeof initialState) => state.companies);

  const [currentLanguage, setCurrentLanguage] = React.useState<string>('fr');
  React.useMemo(() => currentLanguageValue.subscribe(setCurrentLanguage), []);

  const [chartData, setChartData] = React.useState({}) as any;
  const [chartOptions, setChartOptions] = React.useState({});

  const filters = [
    {
    name: translationService(currentLanguage,'FILTER.GENERAL'),
    code: "general"
  },
    {
    name: translationService(currentLanguage,'FILTER.BY_IMPACT'),
    code: "impact"
  },
    {
    name: translationService(currentLanguage,'FILTER.BY_NATURE_OF_IMPACT'),
    code: "natureOfImpact"
  },
    {
    name: translationService(currentLanguage,'FILTER.BY_APPLICABILITY'),
    code: "applicable"
  }
  ];

  const user = useSelector((state: typeof initialState) => state.user);

  const [filterState, setFilterState] =React.useState(filters[0]);

  const countItemsBySector = (array:any) => {
    return array.reduce((accumulator: any, item: any) => {
      const parent = item.parent_of_text;
      const sector = item.sectors_of_activity;

      sector.forEach((sectorItem: any) => {
        if (!accumulator[sectorItem]) {
          accumulator[sectorItem] = 0;
        }

        if (parent) {
          accumulator[sectorItem] += parent.length;
        }
      });

      return accumulator;
    }, {});
  };

  const countItems = (array:any[], condition: Function) => {
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

  };

  const result = laws?.length > 0  ? countItemsBySector(laws) : {};

  const statisticsLawsBySectorOfActivity = {
    air: laws?.filter((x:any) => x.sectors_of_activity.includes("air"))?.length ?? 0,
    terre: laws?.filter((x:any) => x.sectors_of_activity.includes("land"))?.length ?? 0,
    transport: laws?.filter((x:any) => x.sectors_of_activity.includes("transport"))?.length ?? 0,
    environnement: laws?.filter((x:any) => x.sectors_of_activity.includes("environment"))?.length ?? 0,
    eau: laws?.filter((x:any) => x.sectors_of_activity.includes("water"))?.length ?? 0,
    education: laws?.filter((x:any) => x.sectors_of_activity.includes("education"))?.length ?? 0,
    sante: laws?.filter((x:any) => x.sectors_of_activity.includes("health"))?.length ?? 0,
    agriculture: laws?.filter((x:any) => x.sectors_of_activity.includes("agriculture"))?.length ?? 0,
    business: laws?.filter((x:any) => x.sectors_of_activity.includes("business"))?.length ?? 0,
  };

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
  };

  const LawsBySectorOfActivityCompliance = {
    air: statisticsState?.domains?.conformity?.air ?? 0,
    terre: statisticsState?.domains?.conformity?.land ?? 0,
    transport: statisticsState?.domains?.conformity?.transport ?? 0,
    environnement: statisticsState?.domains?.conformity?.environment ?? 0,
    eau: statisticsState?.domains?.conformity?.water ?? 0,
    education: statisticsState?.domains?.conformity?.education ?? 0,
    sante: statisticsState?.domains?.conformity?.health ?? 0,
    agriculture: statisticsState?.domains?.conformity?.agriculture ?? 0,
    business: statisticsState?.domains?.conformity?.business ?? 0,
  };

  const LawsBySectorOfActivityApplicable = {
    air: statisticsState?.domains?.applicability?.air ?? 0,
    terre: statisticsState?.domains?.applicability?.land ?? 0,
    transport: statisticsState?.domains?.applicability?.transport ?? 0,
    environnement: statisticsState?.domains?.applicability?.environment ?? 0,
    eau: statisticsState?.domains?.applicability?.water ?? 0,
    education: statisticsState?.domains?.applicability?.education ?? 0,
    sante: statisticsState?.domains?.applicability?.health ?? 0,
    agriculture: statisticsState?.domains?.applicability?.agriculture ?? 0,
    business: statisticsState?.domains?.applicability?.business ?? 0,
  };

  const applicable = {
    labels: Object.keys(statisticsLawsBySectorOfActivity),
    datasets: [
      {
        type: 'bar',
        label: translationService(currentLanguage,'OPTIONS.YES'),
        data: Object.values(LawsBySectorOfActivityApplicable),
      },{
        type: 'bar',
        label: translationService(currentLanguage,'OPTIONS.NO'),
        data: Object.values(countItems(laws, (x:any) => x?.applicability === 'no')),
      },{
        type: 'bar',
        label: translationService(currentLanguage,'OPTIONS.INFORMATION'),
        data: Object.values(countItems(laws, (x:any) => x?.applicability === 'information')),
      }
    ]
  };

  const natureOfImpact = {
    labels: Object.keys(statisticsLawsBySectorOfActivity),
    datasets: [
      {
        type: 'bar',
        label: translationService(currentLanguage,'OPTIONS.FINANCIAL'),
        data: Object.values(countItems(laws, (x:any) => x?.nature_of_impact === 'financial')),
      },{
        type: 'bar',
        label: 'Organisation',
        data: Object.values(countItems(laws, (x:any) => x?.nature_of_impact === 'organisation')),
      },{
        type: 'bar',
        label: translationService(currentLanguage,'OPTIONS.PRODUCTS'),
        data: Object.values(countItems(laws, (x:any) => x?.nature_of_impact === 'products')),
      },{
        type: 'bar',
        label: translationService(currentLanguage,'OPTIONS.IMAGE'),
        data: Object.values(countItems(laws, (x:any) => x?.nature_of_impact === 'image')),
      }
    ]
  };

  const impact = {
    labels: Object.keys(statisticsLawsBySectorOfActivity),
    datasets: [
      {
        type: 'bar',
        label: translationService(currentLanguage,'OPTIONS.WEAK'),
        data: Object.values(countItems(laws, (x:any) => x?.impact === 'weak')),
        backgroundColor: Object.keys(statisticsLawsBySectorOfActivity).map(() =>'rgba(247,179,34,0.4)'),
      },{
        type: 'bar',
        label: translationService(currentLanguage,'OPTIONS.MEDIUM'),
        data: Object.values(countItems(laws, (x:any) => x?.impact === 'medium')),
        backgroundColor: Object.keys(statisticsLawsBySectorOfActivity).map(() =>'rgba(254,140,28,0.62)'),
      },{
        type: 'bar',
        label: translationService(currentLanguage,'OPTIONS.MAJOR'),
        data: Object.values(countItems(laws, (x:any) => x?.impact === 'major')),
        backgroundColor: Object.keys(statisticsLawsBySectorOfActivity).map(() =>'rgba(232,97,3,0.91)'),
      },{
        type: 'bar',
        label: translationService(currentLanguage,'OPTIONS.CRITICAL'),
        data: Object.values(countItems(laws, (x:any) => x?.impact === 'critical')),
        backgroundColor: Object.keys(statisticsLawsBySectorOfActivity).map(() =>'rgb(255,7,7)'),
      }
    ],
  };

  const generalLawData = {
    labels: Object.keys(statisticsLawsBySectorOfActivity),
    datasets: [
      {
        type: 'bar',
        label: translationService(currentLanguage,'SELECT.BY_SECTOR_OF_ACTIVITIES'),
        data: Object.values(statisticsLawsBySectorOfActivity),
      },{
        type: 'bar',
        label: translationService(currentLanguage,'SELECT.TEXT_BY_SECTOR_OF_ACTIVITY'),
        data: Object.values(LawsBySectorOfActivityParentOfText),
      },{
        type: 'bar',
        label: translationService(currentLanguage,'SELECT.CONFORMED_TEXT_BY_SECTOR_OF_ACTIVITY'),
        data: Object.values(LawsBySectorOfActivityCompliance),
      }
    ]
  };

  const analysisData = {
    labels: [
      translationService(currentLanguage,'PERCENTAGE_ANALYSED'),
      translationService(currentLanguage,'PERCENTAGE_NOT_ANALYSED'),
    ],
    datasets: [
      {
        data: [
          statisticsState?.percentageAnalysed ?? 0,
          statisticsState?.percentageNotAnalysed ?? 0
        ],
      }
    ]
  };

  const generalConformityAnalysis = {
    labels: [
      translationService(currentLanguage,'PERCENTAGE_CONFORM'),
      translationService(currentLanguage,'PERCENTAGE_NOT-CONFORM')
    ],
    datasets: [
      {
        data: [
          statisticsState?.percentageConform ?? 0,
          statisticsState?.percentageNotConform ?? 0
        ],
      }
    ]
  };

  React.useEffect(() => {

    const options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true
          }
        }
      },
    };

    setChartData({
      general: generalLawData,
      generalConformityAnalysis,
      analysisData,
      impact,
      natureOfImpact,
      applicable
    });

    setChartOptions(options);
  }, []);

    return (
      <div>
        <section className="py-3">
          <div className="container px-4 mx-auto">
          <div className='mb-10'>
            <h2 className='text-3xl py-2 font-medium'>{translationService(currentLanguage,'HOME.WELCOME')} {user?.username ?? 'N/A'}</h2>
            <p className='text-gray-400 font-normal'>{translationService(currentLanguage,'HOME.WELCOME.SUBTITLE')}</p>
          </div>
            <div className="mb-6">
              <div className="flex flex-wrap border rounded-md py-8">
                <div className="w-full md:w-1/2 lg:w-1/4 border-r">
                  <div className="max-w-sm  px-6">
                    <div className="max-w-xs">
                      <div className='flex items-center justify-center'>
                        <div>
                          <h4 className="text-2xl leading-8 text-center text-gray-700 font-bold">{laws?.length ?? 0}</h4>
                          <span className="text-gray-700 text-center font-normal">{translationService(currentLanguage,'NUMBER_OF_TEXT')}</span>
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
                          <span className="text-gray-700 text-center font-normal">{translationService(currentLanguage,'NUMBER_OF_CONTROL')}</span>
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
                          <span className="text-gray-700 text-center font-normal">{translationService(currentLanguage,'NUMBER_OF_ACTION_PLAN')}</span>
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
                          <span className="text-gray-700 text-center font-normal">{translationService(currentLanguage,'NUMBER_OF_COMPANY')}</span>
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
                  {translationService(currentLanguage,'STATISTICS.HOME.TITLE1')}
                </h1>
                <Dropdown value={filterState} size={2}
                          onChange={(e) =>  setFilterState(e.value)}
                          options={filters} optionLabel="name"
                          placeholder="Filtre par options"
                          className="w-56 p-inputtext-sm" />
              </div>
              <Chart type="bar" data={chartData?.[filterState?.code]} options={{
              }} className="w-full" />
            </div>

            <div className='grid grid-cols-1 border my-4 rounded-md md:grid-cols-9 '>
              <div className='col-span-3 border-r p-4'>
                <h1
                  className="font-medium text-xl pl-3 mb-4"
                >
                  {translationService(currentLanguage,'STATISTICS.HOME.TITLE2')}
                </h1>
                <br/>
                <Chart type="pie" data={chartData?.generalConformityAnalysis} options={chartOptions} className="w-72" />
              </div>
              <div className='col-span-3 border-r p-4'>
                <h1
                  className="font-medium text-xl pl-3 mb-4"
                >
                  {translationService(currentLanguage,'STATISTICS.HOME.TITLE3')}
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
                          <span className="text-gray-700 text-center font-normal">{translationService(currentLanguage,'CONFORMITY_RATE')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-ful  border-b  py-6">
                    <div className="max-w-sm h-full">
                      <div className="max-w-xs h-full">
                        <div className='flex items-center w-full h-full justify-center flex-col'>
                          <h4 className="text-2xl leading-8 text-center text-gray-700 font-bold">{statisticsState?.totalConform ?? 0}</h4>
                          <span className="text-gray-700 text-center font-normal">{translationService(currentLanguage,'TOTAL_NUMBER_OF_TEXT_CONFORM')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full  py-6">
                    <div className="max-w-sm h-full">
                      <div className="max-w-xs h-full">
                        <div className='flex items-center w-full h-full justify-center flex-col'>
                          <h4 className="text-2xl leading-8 text-center text-gray-700 font-bold">{statisticsState?.totalAnalysed ?? 0}</h4>
                          <span className="text-gray-700 text-center font-normal">{translationService(currentLanguage,'TOTAL_NUMBER_OF_ANALYSED_TEXT')}</span>
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
                  {translationService(currentLanguage,'STATISTICS.HOME.TITLE4')}
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
