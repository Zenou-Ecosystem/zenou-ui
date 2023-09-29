import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ErrorComponent ({ error, resetErrorBoundary }: any) {
  const navigate = useNavigate();
  return (
    <main>
      <section>
        <div className="flex items-center justify-center flex-col h-screen w-screen">
          {/*<img className="mb-5 is-fullwidth p-4" src="metis-assets/illustrations/error2.png" alt="">*/}
          <i className='pi pi-exclamation-circle mb-4 text-blue-500 font-light' style={{ fontSize: '5rem', fontWeight: 'lighter' }}></i>
            <h1 className="text-blue-500 text-2xl md:text-6xl my-4 font-semibold">Oops!</h1>
            <h2 className="font-semibold my-4 text-md md:text-2xl">Something went wrong!</h2>
            <p className="font-medium text-gray-500">Sorry, but we are unable to open this page.</p>
            <button onClick={(e) => {
              e.preventDefault();
              navigate("")
            }} className='bg-blue-600 my-4 font-medium rounded-md px-8 py-2.5 text-sm text-white'>Return to home</button>
        </div>
      </section>
    </main>
  )
}
