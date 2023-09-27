import React from 'react';
import { ProgressBar } from 'primereact/progressbar';

export default function ProgressLoader() {
  return (
    <section className='flex items-center justify-center flex-col top-0 left-0 bg-white z-50 h-[70vh] w-full'>
      <div className='-mt-32'>
        <p className='text-md mb-4 text-center'>Loading....</p>
        <ProgressBar mode="indeterminate" style={{ height: '6px', width: '254px' }}></ProgressBar>
      </div>
    </section>
  )
}


