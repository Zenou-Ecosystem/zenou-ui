import React, { useEffect, useRef, useState } from 'react';
import Filter from "../../../components/filter/Filter";
import Button from "../../../core/Button/Button";
import BasicCard from "../../../core/card/BasicCard";
import Datatable from "../../../core/table/Datatable";
import { Dialog } from 'primereact/dialog';
import { HiPlus } from "react-icons/hi";
import useAppContext from "../../../hooks/useAppContext.hooks";
import { IActions } from "../../../interfaces/actions.interface";
import { fetchActions } from "../../../services/actions.service";
import useActionsContext from "../../../hooks/useActionsContext";
import ActionsContextProvider, { ActionsContext } from "../../../contexts/ActionsContext";
import AddAction from "./AddActions";
import { ActionsActionTypes } from "../../../store/action-types/action.actions";
import { can } from "../../../utils/access-control.utils";
import { AppUserActions } from "../../../constants/user.constants";
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { currentLanguageValue, translationService } from '../../../services/translation.service';

function Actions() {

    const [companies, setActions] = useState<IActions[]>([]);
    const [visible, setVisible] = useState(false);
    const { state, dispatch } = useAppContext();

    const { state: actionstate, dispatch: ActionDispatch } = useActionsContext();
    const [currentLanguage, setCurrentLanguage] = useState<string>('fr');

    React.useMemo(()=>currentLanguageValue.subscribe(setCurrentLanguage), [currentLanguage]);

    const openAddActionForm = () => {
        setVisible(true);
    }

    useEffect(() => {
        (async () => {
            const res = await state;
            let data = res?.data;
            if (!data || data.length < 1) {
                data = await fetchActions();
            }
            setActions(data);
        })();

        (async () => {
            const resolvedActionstate = await actionstate;
            if (resolvedActionstate.hasCreated) {
                console.log('Action state changed => ', resolvedActionstate);
                setVisible(false);
            }
        })();

    }, [state, actionstate]);


    const cardProps = {
        content: `Statistics for the month of February. This is really making
        sense in all areas`,
        title: 'Action Reports'
    }
    const handleNameFilter = (query: string) => {
        console.log("The name typed is ", query);

    }
    const handleCountryFilter = (query: string) => {
        console.log("The country typed is ", query);

    }
    const handleCategoryFilter = (query: string) => {
        console.log("The category typed is ", query);

    }

    const handleCertificationFilter = (query: string) => {
        console.log("The certificate typed is ", query);

    }
    const filterProps = [{
        type: "text",
        onChange: handleNameFilter,
        label: "Name"
    },
    {
        type: "text",
        onChange: handleCountryFilter,
        label: "Country"
    }, {
        type: "text",
        onChange: handleCategoryFilter,
        label: "Category"
    },
    {
        type: "text",
        onChange: handleCertificationFilter,
        label: "Certification"
    }
    ];

    const toast = useRef<Toast>(null);
    const onUpload = () => {
        toast?.current?.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
        fetchActions().then(setActions);
    };

    return (
        <ActionsContextProvider>
            <div className="w-full px-4">
                <Toast ref={toast}></Toast>
                <BasicCard title={translationService(currentLanguage,'ACTIONS.LIST.TITLE')}
                           headerStyles="font-medium text-3xl py-4"
                    content={() => (
                        <>
                            <div className="filter my-8 w-full m-auto flex items-end">
                                <div className="filter w-6/12">
                                    <Filter fields={filterProps} title={translationService(currentLanguage,'ACTIONS.FILTER')} />
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
                                        styles="flex-row-reverse px-6 py-3.5 items-center rounded-full"
                                        onClick={openAddActionForm}
                                        Icon={{
                                            Name: HiPlus,
                                            classes: "",
                                            color: "white",
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
                                <Dialog headerClassName="" contentClassName="pt-4" header={translationService(currentLanguage,'BUTTON.NEW')} visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                                    <AddAction />
                                </Dialog>
                            </div>
                            <Datatable
                                data={companies}
                                fields={['type', 'duration', 'department', 'theme', 'resources', 'Actions']}
                                actionTypes={ActionsActionTypes}
                                context={ActionsContext}
                                accessControls={{
                                    EDIT: AppUserActions.EDIT_ACTIONS,
                                    DELETE: AppUserActions.DELETE_ACTIONS,
                                    VIEW: AppUserActions.VIEW_ACTIONS
                                }}
                            />
                        </>
                    )}
                    styles="px-6"
                />
            </div>
        </ActionsContextProvider>
    );
}


export default Actions;
