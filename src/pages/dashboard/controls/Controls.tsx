import React, { useEffect, useRef, useState } from 'react';
import './controls.scss'
import Button from "../../../core/Button/Button";
import BasicCard from "../../../core/card/BasicCard";
import Datatable from "../../../core/table/Datatable";
import { Dialog } from 'primereact/dialog';
import AddControl from "./AddControl";
import { HiPlus } from "react-icons/hi";
import useAppContext from "../../../hooks/useAppContext.hooks";
import ControlContextProvider, { ControlContext } from "../../../contexts/ControlContext";
import useControlContext from "../../../hooks/useControlContext";
import { ControlActionTypes } from "../../../store/action-types/control.actions";
import { IControl } from "../../../interfaces/controls.interface";
import { fetchControls } from "../../../services/control.service";
import { can } from "../../../utils/access-control.utils";
import { AppUserActions } from "../../../constants/user.constants";
import { Toast } from 'primereact/toast';
import { currentLanguageValue, translationService } from '../../../services/translation.service';

function Controls() {
    const [controls, setControls] = useState<IControl[]>([]);
    const [visible, setVisible] = useState(false);
    const { state, dispatch } = useAppContext();

    const { state: ControlState, dispatch: ControlDispatch } = useControlContext();

    const [currentLanguage, setCurrentLanguage] = useState<string>('fr');

    React.useMemo(()=>currentLanguageValue.subscribe(setCurrentLanguage), [currentLanguage]);

    const openAddControlForm = () => {
        setVisible(true);
    }

    useEffect(() => {
        (async () => {
            const res = await state;
            let data = res?.data;
            data = await fetchControls()
            if (!data || data.length < 1) {
                data = await fetchControls();
            }
            setControls(data);
        })();

        (async () => {
            const resolvedControlState = await ControlState;
            if (resolvedControlState.hasCreated) {
                console.log('Control state changed => ', resolvedControlState);
                setVisible(false);
            }
        })();

    }, [state, ControlState]);

    const toast = useRef<Toast>(null);
    const onUpload = () => {
        toast?.current?.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
        fetchControls().then(setControls);
    };

    return (
        <ControlContextProvider>
            <div className="w-full px-4">
                <Toast ref={toast}></Toast>
                <BasicCard title={""}
                           headerStyles="font-medium text-3xl py-4"
                    content={() => (
                        <>
                            <div className="my-6 w-full m-auto flex justify-between items-center ">
                                <div className="w-6/12">
                                    <h2 className='text-left text-3xl font-medium'>{translationService(currentLanguage,'CONTROLS.LIST.TITLE')}</h2>
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
                                        styles="flex-row-reverse px-6 py-3.5 items-center rounded-full"
                                        onClick={openAddControlForm}
                                        Icon={{
                                            Name: HiPlus,
                                            classes: "",
                                            color: "white",
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
                                    <AddControl />
                                </Dialog>
                            </div>

                            <Datatable
                                data={controls}
                                fields={['type', 'duration', 'department', 'theme', 'resources', 'Actions']}
                                actionTypes={ControlActionTypes}
                                context={ControlContext}
                                accessControls={{
                                    EDIT: AppUserActions.EDIT_CONTROL,
                                    DELETE: AppUserActions.DELETE_CONTROL,
                                    VIEW: AppUserActions.VIEW_CONTROL
                                }}
                            />
                        </>
                    )}
                    styles="px-6"
                />
            </div>
        </ControlContextProvider>
    );
}


export default Controls;
