import React from 'react'
import JoinLineChartComponent from '../../../core/charts/Line/JoinLineChart';
import CustomBarChartComponent from '../../../core/charts/Bar/Custom';
import SimpleAreaChartComponent from '../../../core/charts/Area/Simple';
import LineChartComponent from '../../../core/charts/Line/SimpleLineChart';

function Statistics() {
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
                  Plan d'action
                </h1>
                <button><i className='pi pi-ellipsis-v'></i></button>
              </div>
              <div className='p-4'>
              <LineChartComponent />
              </div>
            </div>

          <div className='border my-8 rounded-md'>
            <div className='flex border-b pt-4 px-4 mb-4 items-center justify-between'>
              <h1
                className="font-medium text-xl pl-3 mb-4"
              >
                Voire les texte
              </h1>
              <button><i className='pi pi-ellipsis-v'></i></button>
            </div>
            <div className='p-4'>
              <JoinLineChartComponent />
            </div>
          </div>


          <div className='border my-8 rounded-md'>
            <div className='flex border-b pt-4 px-4 mb-4 items-center justify-between'>
              <h1
                className="font-medium text-xl pl-3 mb-4"
              >
                Action
              </h1>
              <button><i className='pi pi-ellipsis-v'></i></button>
            </div>
            <div className='p-4'>
              <CustomBarChartComponent />
            </div>
          </div>

          <div className='border my-8 rounded-md'>
            <div className='flex border-b pt-4 px-4 mb-4 items-center justify-between'>
              <h1
                className="font-medium text-xl pl-3 mb-4"
              >
                Entreprise
              </h1>
              <button><i className='pi pi-ellipsis-v'></i></button>
            </div>
            <div className='p-4'>
              <SimpleAreaChartComponent />
            </div>
          </div>

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
