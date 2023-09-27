import React from "react";
import { IModal } from '../../../interfaces/modal.interface';
import { useDispatch } from 'react-redux';
import { ModalActionsTypes } from '../../../store/action-types/modal.actions';

export default function ModalComponent(props: IModal) {
  const dispatch = useDispatch();

  return (
    <section style={{ zIndex: '100' }}
      className="fixed inset-0 top-0 left-0 flex items-center justify-center flex-wrap py-20 bg-gray-900 bg-opacity-80 overflow-y-auto">
      <div className="container px-4 mx-auto">
        <div className="pt-10 px-6 pb-12 text-center max-w-lg mx-auto bg-white border rounded-xl shadow-3xl">
          <div className='mx-auto w-16 h-16 items-center justify-center flex rounded-full'>
            <i hidden={props.severity !== "DANGER"}
               className='pi pi-trash my-4 text-red-500 mx-auto' style={{ fontSize: '1.5rem' }}>
            </i>
            <i hidden={props.severity !== "INFO"}
               className='pi pi-info my-4 text-blue-500 mx-auto' style={{ fontSize: '1.5rem' }}>
            </i>
            <i hidden={props.severity !== "WARNING"}
               className='pi pi-exclamation-triangle my-4 text-orange-500 mx-auto' style={{ fontSize: '1.5rem' }}>
            </i>
            <i hidden={props.severity !== "SUCCESS"}
               className='pi pi-check my-4 text-green-500 mx-auto' style={{ fontSize: '1.5rem' }}>
            </i>
          </div>
          <h3 className="font-heading mb-2 text-xl font-semibold">{props.headerText}</h3>
          <p className="mb-6 text-neutral-500">{props.bodyText}</p>
          <div className="flex flex-wrap justify-center -m-1">
            <div className="w-auto p-1">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  dispatch({type: ModalActionsTypes.HIDE_MODAL});
                }}
                className="inline-flex px-5 py-2.5 text-sm font-medium border border-neutral-200 hover:border-neutral-300 rounded-lg"
              >
                Cancel
              </button>
            </div>
            {props.actions?.length ? props.actions.map((actions, index) => (
              <div className="w-auto p-1" key={index}>
                <button className="inline-flex px-5 py-2.5 text-sm text-white font-medium bg-blue-600 rounded-lg"
                        onClick={(e) => {
                          e.preventDefault();
                          actions.onClick();
                        }}
                >
                  {actions.name}
                </button>
              </div>
            ) ): ''}
          </div>
        </div>
      </div>
    </section>
  )
}
