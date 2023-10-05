import React, { useState } from 'react';
import { fetchAllKpis, filterAndSummarizeDateRange } from '../../../services/kpi.service';
import { LocalStore } from '../../../utils/storage.utils';
import { Chart } from 'primereact/chart';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import { LawActionTypes } from '../../../store/action-types/laws.actions';
import { LawContext } from '../../../contexts/LawContext';
import Datatable from '../../../core/table/Datatable';
import { AppUserActions } from '../../../constants/user.constants';
import { currentLanguageValue, translationService } from '../../../services/translation.service';
import Button from '../../../core/Button/Button';
import { initialState } from '../../../store/state';
import {useSelector} from "react-redux";

export default function Statistics() {
  const [state, setState] = React.useState() as any;
  const [chartData, setChartData] = React.useState({}) as any;
  const [chartOptions, setChartOptions] = React.useState({});
  const [dates, setDates] = React.useState<any>([]);
  const [lawsStatistics, setStatistics] = React.useState<any>({ laws: [], summary: {} });

  const user = useSelector((state: typeof initialState) => state.user);

  const defaultDates = [new Date(Date.now()).toISOString(), new Date().toISOString()];

  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');
  React.useMemo(() => currentLanguageValue.subscribe(setCurrentLanguage), []);

  React.useEffect(()=> {
    (async () => {

      const data = await fetchAllKpis(user?.role as string);
      const filter = await filterAndSummarizeDateRange(user?.role as string, {
        summary:true
      })
      setStatistics(filter ?? { laws: [], summary: {} });
      setState(data);

   const generalLawData = {
     labels: [
       translationService(currentLanguage,'PERCENTAGE_ANALYSED'),
       translationService(currentLanguage,'PERCENTAGE_NOT_ANALYSED'),
     ],
      datasets: [
        {
          data: [data?.percentageAnalysed ?? 0, data?.percentageNotAnalysed ?? 0],
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
          data: [data?.percentageConform ?? 0, data?.percentageNotConform ?? 0],
        }
      ]
    };

    const filterByDatesLawDate = {
      labels: [
        translationService(currentLanguage,'PERCENTAGE_ANALYSED'),
        translationService(currentLanguage,'PERCENTAGE_NOT_ANALYSED'),
      ],
      datasets: [
        {
          data: [filter?.summary?.percentageAnalysed ?? 0, filter?.summary?.percentageNotAnalysed ?? 0],
        }
      ]
    };

    const filterByDatesConformityData = {
      labels: [
        translationService(currentLanguage,'PERCENTAGE_CONFORM'),
        translationService(currentLanguage,'PERCENTAGE_NOT-CONFORM')
      ],
      datasets: [
        {
          data: [filter?.summary?.percentageConform ?? 0, filter?.summary?.percentageNotConform ?? 0],
        }
      ]
    };

    const options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true
          }
        }
      }
    };

    setChartData({ generalLawData, generalConformityAnalysis, filterByDatesLawDate, filterByDatesConformityData });
    setChartOptions(options);
    })()

  }, [user?.role]);

    const submitDate = async () => {

      const filter = await filterAndSummarizeDateRange(user?.role as string, {
        startDate: new Date(dates[0] ?? "2023-08-30T11:36:30.350Z").toISOString(),
        endDate: new Date(dates[1] ?? "2023-08-30T11:36:30.350Z").toISOString(),
        summary:true
      })

      setStatistics(filter ?? { laws: [], summary: {} });
      setChartData((previousState: any) => {
        return {  ...previousState,
          filterByDatesLawDate: {
            labels: [
              translationService(currentLanguage,'PERCENTAGE_ANALYSED'),
              translationService(currentLanguage,'PERCENTAGE_NOT_ANALYSED'),
            ],
            datasets: [
              {
                data: [filter?.summary?.percentageAnalysed ?? 0, filter?.summary?.percentageNotAnalysed ?? 0],
              }
            ]
          }
        ,
        filterByDatesConformityData: {
          labels: [
            translationService(currentLanguage,'PERCENTAGE_CONFORM'),
            translationService(currentLanguage,'PERCENTAGE_NOT-CONFORM')
          ],
          datasets: [
            {
              data: [filter?.summary?.percentageConform ?? 0, filter?.summary?.percentageNotConform ?? 0],
            }
          ]
          }
        }
      });
    }

    // @ts-ignore
  return (
        <div className='mt-10'>
          <div className='mb-10 md:px-10'>
            <h2 className='text-2xl py-2 font-medium'>{translationService(currentLanguage,'STATISTICS.TITLE')}</h2>
            <p className='text-gray-400 font-normal'>{translationService(currentLanguage,'STATISTICS.SUBTITLE')}</p>
          </div>
          <div className='w-11/12 mx-auto'>
            <div className='my-8'>
              <div className='flex border-b pb-2 mb-4 md:items-center md:flex-row flex-col justify-between'>
                <h1
                  className="font-medium text-lg"
                >
                  {translationService(currentLanguage,'STATISTICS.BY_DATE_RANGE')}
                </h1>
                <div className='flex gap-4'>
                  <Calendar placeholder="Range" className='p-inputtext-sm' value={dates} onChange={(e : CalendarChangeEvent) => setDates(e?.value)} selectionMode="range" readOnlyInput />
                  {" "}
                  <Button
                    title={translationService(currentLanguage,'REGISTRATION.BUTTON.SUBMIT')}
                    styles="flex-row-reverse relative bottom-0 px-4 py-2.5 text-sm items-center rounded-full"
                    onClick={submitDate}
                    Icon={{
                      Name: () => (<i className='pi pi-plus text-white' />),
                    }}
                  />
                  {/*<Button label={"soumettre"} onClick={submitDate} />*/}
                </div>
              </div>

              <div className='py-4'>
                <div className="flex flex-wrap border ">
                  <div className="w-full md:w-1/2 lg:w-1/2 border-r">
                    <div className="max-w-sm h-full  p-6">
                      <div className="max-w-xs h-full">
                        <div className='flex items-center w-full h-full justify-center flex-col'>
                          <h4 className="text-2xl leading-8 text-center text-gray-700 font-bold">{lawsStatistics?.summary?.costOfCompliance?.expected ?? "0"} XAF</h4>
                          <span className="text-gray-700 text-center font-normal">{translationService(currentLanguage,'TOTAL_EXPECTED_COMPLIANCE_AMOUNT')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 lg:w-1/2">
                    <div className="max-w-sm h-full  p-6">
                      <div className="max-w-xs h-full">
                        <div className='flex py-4 items-center w-full h-full justify-center flex-col'>
                          <h4 className="text-2xl leading-8 text-center text-gray-700 font-bold">{lawsStatistics?.summary?.costOfCompliance?.actual ?? "0"} XAF</h4>
                          <span className="text-gray-700 text-center font-normal">{translationService(currentLanguage,'TOTAL_ACTUAL_COMPLIANCE_AMOUNT')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className=''>
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="border py-4 flex items-center justify-center w-full md:w-1/2">
                    <Chart type="pie" data={chartData?.filterByDatesLawDate} options={chartOptions} className="w-72" />
                  </div>
                  <div className=" border md:border-y md:border-r py-4 flex items-center justify-center w-full md:w-1/2">
                    <Chart type="pie" data={chartData?.filterByDatesConformityData} options={chartOptions} className="w-72" />
                  </div>
                </div>

                <div className='py-4'>
                  <div className="flex flex-wrap border ">
                    <div className="w-full md:w-1/3 lg:w-1/3 border-r">
                      <div className="max-w-sm h-full  py-10">
                        <div className="max-w-xs h-full">
                          <div className='flex items-center w-full h-full justify-center flex-col'>
                            <h4 className="text-2xl leading-8 text-center text-gray-700 font-bold">{lawsStatistics?.summary?.total ?? "0"}</h4>
                            <span className="text-gray-700 font-normal">{translationService(currentLanguage,'NUMBER_OF_TEXT')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-1/3 lg:w-1/3 border-r">
                      <div className="max-w-sm h-full  p-6">
                        <div className="max-w-xs h-full">
                          <div className='flex items-center w-full h-full justify-center flex-col'>
                            <h4 className="text-2xl leading-8 text-center text-gray-700 font-bold">{lawsStatistics?.summary?.totalConform ?? "0"}</h4>
                            <span className="text-gray-700 font-normal">{translationService(currentLanguage,'TOTAL_NUMBER_OF_TEXT_CONFORM')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-1/3 lg:w-1/3">
                      <div className="max-w-sm h-full  p-6">
                        <div className="max-w-xs h-full">
                          <div className='flex items-center w-full h-full justify-center flex-col'>
                            <h4 className="text-2xl leading-8 text-center text-gray-700 font-bold">{lawsStatistics?.summary?.totalAnalysed ?? "0"}</h4>
                            <span className="text-gray-700 font-normal">{translationService(currentLanguage,'TOTAL_NUMBER_OF_ANALYSED_TEXT')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/*<Datatable*/}
                {/*  data={lawsStatistics?.laws ?? []}*/}
                {/*  fields={[*/}
                {/*    "title_of_text",*/}
                {/*    "type_of_text",*/}
                {/*    "actions",*/}
                {/*  ]}*/}
                {/*  actionTypes={LawActionTypes}*/}
                {/*  context={LawContext}*/}
                {/*  translationKey={'LAW.ADD.FORM'}*/}
                {/*  accessControls={{*/}
                {/*    EDIT: AppUserActions.EDIT_LAW,*/}
                {/*    DELETE: AppUserActions.DELETE_LAW,*/}
                {/*    VIEW: AppUserActions.VIEW_LAW,*/}
                {/*  }}*/}
                {/*/>*/}

              </div>
            </div>

          </div>
        </div>
    )
}
