import React from 'react'
import JoinLineChartComponent from '../../../core/charts/Line/JoinLineChart';
import CustomBarChartComponent from '../../../core/charts/Bar/Custom';
import SimpleAreaChartComponent from '../../../core/charts/Area/Simple';
import LineChartComponent from '../../../core/charts/Line/SimpleLineChart';
import { fetchAllKpis, filterAndSummarizeDateRange } from '../../../services/kpi.service';
import { LocalStore } from '../../../utils/storage.utils';
import { Chart } from 'primereact/chart';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
function Statistics() {
  const [state, setState] = React.useState() as any;
  const [chartData, setChartData] = React.useState({}) as any;
  const [chartOptions, setChartOptions] = React.useState({});
  const [dates, setDates] = React.useState<string | Date | Date[] | null | undefined>(null);

  React.useEffect(()=> {
    (async () => {
      const userRole = LocalStore.get('user');
      const data = await fetchAllKpis(userRole?.role);
      const filter = await filterAndSummarizeDateRange(userRole?.role, {
        summary: false,
        pageSize: 100,
        // startDate: new Date("01/01/2010"),
        // endDate: new Date()
      })
      console.log(filter);
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
    const options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true
          }
        }
      }
    };

    setChartData({ generalLawData, generalConformityAnalysis });
    setChartOptions(options);
    })()

  }, [])
    return (
        <div>
            {/*<CustomActiveShapeChartComponent />*/}
          <div className='mb-10 pl-4'>
            <h2 className='text-3xl py-2 font-medium'>Statistique</h2>
            <p className='text-gray-400 font-normal'>Section des statistique du systeme</p>
          </div>
          <div className='w-11/12 mx-auto'>
            <div className='border my-8 rounded-md'>
              <div className='flex border-b pt-4 px-4 mb-4 items-center justify-between'>
                <h1
                  className="font-medium text-xl pl-3 mb-4"
                >
                  Statistique des Lois
                </h1>
                <button><i className='pi pi-ellipsis-v'></i></button>
              </div>
              <div className='p-4'>
                <div className="flex flex-wrap border-b ">
                  <div className="w-full md:w-1/3 lg:w-1/3 border-r">
                    <div className="max-w-sm h-full  py-10">
                      <div className="max-w-xs h-full">
                        <div className='flex items-center w-full h-full justify-center flex-col'>
                            <h4 className="text-2xl leading-8 text-center text-gray-700 font-bold">{state?.total}</h4>
                            <span className="text-gray-700 font-normal">Taux de loi</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/3 lg:w-1/3 border-r">
                    <div className="max-w-sm h-full  p-6">
                      <div className="max-w-xs h-full">
                        <div className='flex items-center w-full h-full justify-center flex-col'>
                          <h4 className="text-2xl leading-8 text-center text-gray-700 font-bold">{state?.totalConform}</h4>
                          <span className="text-gray-700 font-normal">Taux de loi conforme</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/3 lg:w-1/3">
                    <div className="max-w-sm h-full  p-6">
                      <div className="max-w-xs h-full">
                        <div className='flex items-center w-full h-full justify-center flex-col'>
                          <h4 className="text-2xl leading-8 text-center text-gray-700 font-bold">{state?.totalAnalysed}</h4>
                          <span className="text-gray-700 font-normal">Taux de loi analyser</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-evenly items-center">
                  <Chart type="pie" data={chartData?.generalLawData} options={chartOptions} className="w-72" />
                  <Chart type="pie" data={chartData?.generalConformityAnalysis} options={chartOptions} className="w-72" />
                </div>

              {/*<LineChartComponent />*/}
              </div>
            </div>

          <div className='border my-8 rounded-md'>
            <div className='flex border-b p-4 mb-4 items-center justify-between'>
              <h1
                className="font-medium text-xl pl-3"
              >
                Statistique des lois par date
              </h1>
              <div>
                <Calendar showIcon placeholder="Range" value={dates} onChange={(e : CalendarChangeEvent) => setDates(e?.value)} selectionMode="range" readOnlyInput />
              </div>
              {/*<button><i className='pi pi-ellipsis-v'></i></button>*/}
            </div>
            <div className='p-4'>
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
