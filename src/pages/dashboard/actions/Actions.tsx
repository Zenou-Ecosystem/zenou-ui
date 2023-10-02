import React, { useRef, useState } from 'react';
import Button from "../../../core/Button/Button";
import BasicCard from "../../../core/card/BasicCard";
import Datatable from "../../../core/table/Datatable";
import { Dialog } from 'primereact/dialog';
import { HiPlus } from "react-icons/hi";
import { ActionsContext } from "../../../contexts/ActionsContext";
import AddAction from "./AddActions";
import { ActionsActionTypes } from '../../../store/action-types/action.actions';
import { can } from "../../../utils/access-control.utils";
import { AppUserActions } from "../../../constants/user.constants";
import { useSelector } from 'react-redux';
import { Toast } from 'primereact/toast';
import { currentLanguageValue, translationService } from '../../../services/translation.service';
import EditAction from './EditAction';
import { initialState } from '../../../store/state';

function Actions() {

  const actions = useSelector((state: typeof initialState) => state.actions);

    const [visible, setVisible] = useState(false);
    const [showEdit, setShowEdit]= useState(false);

    const [currentLanguage, setCurrentLanguage] = useState<string>('fr');

    React.useMemo(() => currentLanguageValue.subscribe(setCurrentLanguage), [currentLanguage]);

    const openAddActionForm = () => {
        setVisible(true);
    }

    const toast = useRef<Toast>(null);

    return (
      <div className="w-full md:px-4">
        <Toast ref={toast}></Toast>
        <BasicCard title={''}
                   headerStyles="font-medium text-3xl py-4"
                   content={() => (
                     <>
                       <div className="my-6 w-full m-auto flex justify-between items-center">
                         <div className="w-full md:w-6/12">
                           <h2 className='text-left text-2xl font-medium'>
                             {translationService(currentLanguage,'ACTIONS.LIST.TITLE')}
                           </h2>
                         </div>
                         {!can(AppUserActions.ADD_ACTIONS) ? null : (
                           <div className="flex justify-end gap-2 w-6/12">
                             {/*<button className='py-2.5 px-6 shadow-sm flex gap-3 items-center text-white bg-blue-500 rounded-md'>*/}
                             {/*  <i className='pi pi-file-excel'></i>*/}
                             {/*  Import*/}
                             {/*</button>*/}
                             {/*<FileUpload mode="basic" name="file" url="http://localhost:3001/actions/upload" onUpload={onUpload} accept=".csv, .xlsx" maxFileSize={1000000} auto chooseLabel={translationService(currentLanguage,'BUTTON.IMPORT')} />*/}
                             {/*<button className='py-2.5 px-6 shadow-sm flex gap-3 items-center text-white bg-red-500 rounded-md'>*/}
                             {/*    <i className='pi pi-file-import'></i>*/}
                             {/*    Export*/}
                             {/*</button>*/}
                             <Button
                               title={translationService(currentLanguage,'BUTTON.NEW')}
                               styles="flex-row-reverse px-4 py-2.5 text-sm items-center rounded-full"
                               onClick={openAddActionForm}
                               Icon={{
                                 Name: () => (<i className='pi pi-plus text-white' />),
                               }}
                             />
                           </div>
                         )}
                       </div>
                       {/*<div className="filter my-4 w-11/12 m-auto flex">*/}
                       {/*    {*/}
                       {/*        !can(AppUserActions.ADD_ACTIONS) ? null : <div className="add-btn w-2/12">*/}
                       {/*            <Button title="New"*/}
                       {/*                styles="flex justify-around flex-row-reverse items-center rounded-full"*/}
                       {/*                onClick={openAddActionForm} Icon={{*/}
                       {/*                    Name: HiPlus,*/}
                       {/*                    classes: '',*/}
                       {/*                    color: 'white'*/}
                       {/*                }} />*/}
                       {/*        </div>*/}
                       {/*    }*/}
                       {/*    <div className="filter w-10/12">*/}
                       {/*        <Filter fields={filterProps} title='Filter Actions' />*/}
                       {/*    </div>*/}
                       {/*</div>*/}

                       <div className="add-form my-10">
                         <Dialog contentClassName="pt-4"
                                 header={translationService(currentLanguage,'BUTTON.NEW')}
                                 visible={visible} style={{ width: '680px', maxWidth: '100%' }}
                                 onHide={() => setVisible(false)}>
                           <AddAction hideAction={ () => setVisible(false)} stateGetter={() => {
                             // fetchActions().then(setActions)
                           }} />
                         </Dialog>

                         <Dialog contentClassName="pt-4"
                                 header={translationService(currentLanguage,'BUTTON.NEW')}
                                 visible={showEdit} style={{ width: '680px', maxWidth: '100%' }}
                                 onHide={() => setShowEdit(false)}>
                           <EditAction hideAction={ () => setShowEdit(false)}
                                       stateGetter={() => {
                                         // fetchActions().then(setActions)
                                       }}
                           />
                         </Dialog>
                       </div>
                       <Datatable
                         data={actions}
                         fields={['type', 'duration', 'department', 'theme', 'Actions']}
                         actionTypes={ActionsActionTypes}
                         context={ActionsContext}
                         translationKey={"FORM"}
                         actions={{edit: ()=> setShowEdit(true)}}
                         accessControls={{
                           EDIT: ActionsActionTypes.EDIT_ACTION,
                           DELETE: ActionsActionTypes.DELETE_ACTION,
                           VIEW: ActionsActionTypes.VIEW
                         }}
                       />
                     </>
                   )}
                   styles="px-6"
        />
      </div>
    );
}


export default Actions;
