import React from 'react'
import { fetchAllKpis, filterAndSummarizeDateRange } from '../../../services/kpi.service';
import { LocalStore } from '../../../utils/storage.utils';
import { Chart } from 'primereact/chart';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import { LawActionTypes } from '../../../store/action-types/laws.actions';
import { LawContext } from '../../../contexts/LawContext';
import Datatable from '../../../core/table/Datatable';
import { AppUserActions } from '../../../constants/user.constants';
import { Button } from 'primereact/button';
function Statistics() {
  const [state, setState] = React.useState() as any;
  const [chartData, setChartData] = React.useState({}) as any;
  const [chartOptions, setChartOptions] = React.useState({});
  const [dates, setDates] = React.useState<any>([]);
  const [lawsStatistics, setStatistics] = React.useState<any>({ laws: [], summary: {} });

  const defaultDates = [new Date(Date.now()).toISOString(), new Date().toISOString()]
  React.useEffect(()=> {
    (async () => {
      const userRole = LocalStore.get('user');
      const data = await fetchAllKpis(userRole?.role);
      const filter = await filterAndSummarizeDateRange(userRole?.role, {
        startDate: defaultDates[0],
        endDate: defaultDates[1],
        summary:true
      })
      setStatistics(filter ?? { laws: [], summary: {} });
      setState(data);

   const generalLawData = {
      labels: ["Poucentage analysé", 'Poucentage non-analysé'],
      datasets: [
        {
          data: [data?.percentageAnalysed ?? 0, data?.percentageNotAnalysed ?? 0],
        }
      ]
    }
    const generalConformityAnalysis = {
      labels: ["Poucentage comforme", 'Poucentage non-conforme'],
      datasets: [
        {
          data: [data?.percentageConform ?? 0, data?.percentageNotConform ?? 0],
        }
      ]
    }

    const filterByDatesLawDate = {
      labels: ["Poucentage analysé", 'Poucentage non-analysé'],
      datasets: [
        {
          data: [filter?.summary?.percentageAnalysed ?? 0, filter?.summary?.percentageNotAnalysed ?? 0],
        }
      ]
    }

    const filterByDatesConformityData = {
      labels: ["Poucentage comforme", 'Poucentage non-conforme'],
      datasets: [
        {
          data: [filter?.summary?.percentageConform ?? 0, filter?.summary?.percentageNotConform ?? 0],
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

    setChartData({ generalLawData, generalConformityAnalysis, filterByDatesLawDate, filterByDatesConformityData });
    setChartOptions(options);
    })()


  }, [])
    const submitDate = async () => {
      const userRole = LocalStore.get('user');

      const filter = await filterAndSummarizeDateRange(userRole?.role, {
        startDate: new Date(dates[0] ?? "2023-08-30T11:36:30.350Z").toISOString(),
        endDate: new Date(dates[1] ?? "2023-08-30T11:36:30.350Z").toISOString(),
        summary:true
      })

      setStatistics(filter ?? { laws: [], summary: {} });
      setChartData((previousState: any) => {
        return {  ...previousState,
          filterByDatesLawDate: {
            labels: ["Poucentage analysé", 'Poucentage non-analysé'],
            datasets: [
              {
                data: [filter?.summary?.percentageAnalysed ?? 0, filter?.summary?.percentageNotAnalysed ?? 0],
              }
            ]
          }
        ,
        filterByDatesConformityData: {
          labels: ["Poucentage comforme", 'Poucentage non-conforme'],
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
        <div>
            {/*<CustomActiveShapeChartComponent />*/}
          <div className='mb-10 px-10'>
            <h2 className='text-3xl py-2 font-medium'>Statistique</h2>
            <p className='text-gray-400 font-normal'>Section des statistique du systeme</p>
          </div>
          <div className='w-11/12 mx-auto'>
            <div className='my-8'>
              <div className='flex border-b pb-2 mb-4 items-center justify-between'>
                <h1
                  className="font-medium text-lg"
                >
                  Statistique lois generales
                </h1>
                <div>
                  <Calendar placeholder="Range" value={dates} onChange={(e : CalendarChangeEvent) => setDates(e?.value)} selectionMode="range" readOnlyInput />
                  {" "}
                  <Button label={"soumettre"} onClick={submitDate} />
                </div>
              </div>

              <div className='py-4'>
                <div className="flex flex-wrap border ">
                  <div className="w-full md:w-1/2 lg:w-1/2 border-r">
                    <div className="max-w-sm h-full  p-6">
                      <div className="max-w-xs h-full">
                        <div className='flex items-center w-full h-full justify-center flex-col'>
                          <h4 className="text-2xl leading-8 text-center text-gray-700 font-bold">{lawsStatistics?.summary?.costOfCompliance?.expected ?? "0"} XAF</h4>
                          <span className="text-gray-700 text-center font-normal">Taux de montant requi d'applicabilité</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 lg:w-1/2">
                    <div className="max-w-sm h-full  p-6">
                      <div className="max-w-xs h-full">
                        <div className='flex py-4 items-center w-full h-full justify-center flex-col'>
                          <h4 className="text-2xl leading-8 text-center text-gray-700 font-bold">{lawsStatistics?.summary?.costOfCompliance?.actual ?? "0"} XAF</h4>
                          <span className="text-gray-700 text-center font-normal">Taux de montant deja verse</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className=''>
                <div className="flex justify-between items-center">
                  <div className="border py-4 flex items-center justify-center w-1/2">
                    <Chart type="pie" data={chartData?.filterByDatesLawDate} options={chartOptions} className="w-72" />
                  </div>
                  <div className="border-y border-r py-4 flex items-center justify-center w-1/2">
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
                            <span className="text-gray-700 font-normal">Taux de loi</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-1/3 lg:w-1/3 border-r">
                      <div className="max-w-sm h-full  p-6">
                        <div className="max-w-xs h-full">
                          <div className='flex items-center w-full h-full justify-center flex-col'>
                            <h4 className="text-2xl leading-8 text-center text-gray-700 font-bold">{lawsStatistics?.summary?.totalConform ?? "0"}</h4>
                            <span className="text-gray-700 font-normal">Taux de loi conforme</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-1/3 lg:w-1/3">
                      <div className="max-w-sm h-full  p-6">
                        <div className="max-w-xs h-full">
                          <div className='flex items-center w-full h-full justify-center flex-col'>
                            <h4 className="text-2xl leading-8 text-center text-gray-700 font-bold">{lawsStatistics?.summary?.totalAnalysed ?? "0"}</h4>
                            <span className="text-gray-700 font-normal">Taux de loi analyser</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Datatable
                  data={lawsStatistics?.laws ?? []}
                  fields={[
                    "title_of_text",
                    "type_of_text",
                    "actions",
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

                {/*<JoinLineChartComponent />*/}
              </div>
            </div>

          {/*<div className='border my-8 rounded-md'>*/}
          {/*  <div className='flex border-b pt-4 px-4 mb-4 items-center justify-between'>*/}
          {/*    <h1*/}
          {/*      className="font-medium text-xl pl-3 mb-4"*/}
          {/*    >*/}
          {/*      Action*/}
          {/*    </h1>*/}
          {/*    <button><i className='pi pi-ellipsis-v'></i></button>*/}
          {/*  </div>*/}
          {/*  <div className='p-4'>*/}
          {/*    <CustomBarChartComponent />*/}
          {/*  </div>*/}
          {/*</div>*/}

          {/*<div className='border my-8 rounded-md'>*/}
          {/*  <div className='flex border-b pt-4 px-4 mb-4 items-center justify-between'>*/}
          {/*    <h1*/}
          {/*      className="font-medium text-xl pl-3 mb-4"*/}
          {/*    >*/}
          {/*      Entreprise*/}
          {/*    </h1>*/}
          {/*    <button><i className='pi pi-ellipsis-v'></i></button>*/}
          {/*  </div>*/}
          {/*  <div className='p-4'>*/}
          {/*    <SimpleAreaChartComponent />*/}
          {/*  </div>*/}
          {/*</div>*/}

          </div>



          {/*<div className='border rounded-md'>*/}
          {/*  <div className='flex border-b pt-4 px-4 mb-4 items-center justify-between'>*/}
          {/*    <h1*/}
          {/*      className="font-medium text-xl pl-3 mb-4"*/}
          {/*    >*/}
          {/*      Voire les texte*/}
          {/*    </h1>*/}
          {/*    <button><i className='pi pi-ellipsis-v'></i></button>*/}
          {/*  </div>*/}
          {/*  <div className='p-4'>*/}
          {/*    <CustomBarChartComponent />*/}
          {/*  </div>*/}
          {/*</div>*/}



            {/*<SimpleAreaChartComponent />*/}
            {/*<PieWithNeedleChartComponent />*/}
            {/*<PieWithCustomLabelChartComponent />*/}
            {/*<LineChartComponent />*/}
        </div>
    )
}

export default Statistics
