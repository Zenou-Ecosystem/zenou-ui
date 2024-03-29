import React from 'react';
import './controls.scss'
import Button from "../../../core/Button/Button";
import BasicCard from "../../../core/card/BasicCard";
import Datatable from "../../../core/table/Datatable";
import { Dialog } from 'primereact/dialog';
import AddControl from "./AddControl";
import { ControlContext } from "../../../contexts/ControlContext";
import { ControlActionTypes } from "../../../store/action-types/control.actions";
import { can } from "../../../utils/access-control.utils";
import { AppUserActions } from "../../../constants/user.constants";
import { currentLanguageValue, translationService } from '../../../services/translation.service';
import EditControl from './EditControl';
import { useSelector } from 'react-redux';
import { initialState } from '../../../store/state';

function Controls() {
    const controls = useSelector((state: typeof initialState) => state.controls);

    const [visible, setVisible] = React.useState(false);
    const [editVisible, setEditVisible] = React.useState(false);

    const [currentLanguage, setCurrentLanguage] = React.useState<string>('fr');

    React.useMemo(()=>currentLanguageValue.subscribe(setCurrentLanguage), []);

    const openAddControlForm = () => {
        setVisible(true);
    }

    // const onUpload = () => {
    //     toast?.current?.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    //     // fetchControls().then(setControls);
    // };

    return (
      <div className="w-full md:px-4">
        <BasicCard title={""}
                   headerStyles="font-medium text-3xl py-4"
                   content={() => (
                     <>
                       <div className="my-6 w-full m-auto flex justify-between items-center ">
                         <div className="w-full md:w-6/12">
                           <h2 className='text-left text-2xl font-medium'>
                             {translationService(currentLanguage,'CONTROLS.LIST.TITLE')}
                           </h2>
                         </div>
                         {!can(AppUserActions.ADD_CONTROL) ? null : (
                           <div className="flex justify-end gap-2 w-6/12">
                             {/*<button className='py-2.5 px-6 shadow-sm flex gap-3 items-center text-white bg-blue-500 rounded-md'>*/}
                             {/*  <i className='pi pi-file-excel'></i>*/}
                             {/*  Import*/}
                             {/*</button>*/}
                             {/*<FileUpload mode="basic" name="file" url="http://localhost:3001/controls/upload" onUpload={onUpload} accept=".csv, .xlsx" maxFileSize={1000000} auto chooseLabel={translationService(currentLanguage,'BUTTON.IMPORT')} />*/}
                             {/*<button className='py-2.5 px-6 shadow-sm flex gap-3 items-center text-white bg-red-500 rounded-md'>*/}
                             {/*    <i className='pi pi-file-import'></i>*/}
                             {/*    Export*/}
                             {/*</button>*/}
                             <Button
                               title={translationService(currentLanguage,'BUTTON.NEW')}
                               styles="flex-row-reverse px-4 py-2.5 text-sm items-center rounded-full"
                               onClick={openAddControlForm}
                               Icon={{
                                 Name: () => (<i className='pi pi-plus text-white' />),
                               }}
                             />
                           </div>
                         )}
                       </div>

                       <div className="add-form my-10">
                         <Dialog header={translationService(currentLanguage,'BUTTON.NEW')}
                                 visible={visible}
                                 style={{ width: '680px', maxWidth: '100%' }}
                                 onHide={() => setVisible(false)}>
                           <AddControl stateGetter={() => {}}
                                       hideAction={()=>setVisible(false)}
                           />
                         </Dialog>
                         <Dialog header={translationService(currentLanguage,'BUTTON.NEW')}
                                 visible={editVisible}
                                 style={{ width: '680px', maxWidth: '100%' }}
                                 onHide={() => setEditVisible(false)}>
                           <EditControl stateGetter={() => {}}
                                        hideAction={()=>setVisible(false)}
                           />
                         </Dialog>
                       </div>

                       <Datatable
                         data={controls}
                         fields={['type', 'duration', 'department', 'theme', 'resources', 'Actions']}
                         actionTypes={ControlActionTypes}
                         context={ControlContext}
                         translationKey={"FORM"}
                         actions={{edit: () => setEditVisible(true)}}
                         accessControls={{
                           EDIT: ControlActionTypes.EDIT_CONTROL,
                           DELETE: ControlActionTypes.DELETE_CONTROL,
                           VIEW: ControlActionTypes.VIEW
                         }}
                       />
                     </>
                   )}
                   styles="px-6"
        />
      </div>
    );
}


export default Controls;
