import React, { useEffect, useRef, useState } from 'react';
import Filter from "../../../components/filter/Filter";
import Button from "../../../core/Button/Button";
import BasicCard from "../../../core/card/BasicCard";
import Datatable from "../../../core/table/Datatable";
import { Dialog } from "primereact/dialog";
import AddLaw from "./AddLaw";
import { HiFolderAdd, HiPlus } from 'react-icons/hi';
import useAppContext from "../../../hooks/useAppContext.hooks";
import LawContextProvider, { LawContext } from "../../../contexts/LawContext";
import useLawContext from "../../../hooks/useLawContext";
import { ILaws } from "../../../interfaces/laws.interface";
import { LawActionTypes } from "../../../store/action-types/laws.actions";
import { fetchLaws } from "../../../services/laws.service";
import { can } from "../../../utils/access-control.utils";
import { AppUserActions } from "../../../constants/user.constants";
import { LocalStore } from "../../../utils/storage.utils";
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { currentLanguageValue, translationService } from '../../../services/translation.service';

function Laws() {
  const [laws, setLaws] = useState<ILaws[]>([]);
  const [visible, setVisible] = useState(false);
  const { state } = useAppContext();
  const { state: LawState } = useLawContext();
  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');

  React.useMemo(()=>currentLanguageValue.subscribe(setCurrentLanguage), [currentLanguage]);

  const openAddLawForm = () => {
    setVisible(true);
  };

  useEffect(() => {
    (async () => {
      const res = await state;
      let data = res?.data;
      if (!data || data?.length < 1) {
        data = await fetchLaws();
      }
      setLaws(data);
    })();

    (async () => {
      const resolvedLawState = await LawState;
      if (resolvedLawState.hasCreated) {
        console.log("Law state changed => ", resolvedLawState);
        setVisible(false);
      }
    })();
  }, [state, LawState]);

  const cardProps = {
    content: `Statistics for the month of February. This is really making
        sense in all areas`,
    title: "Law Statistics",
  };
  const handleNameFilter = (query: string) => {
    console.log("The name typed is ", query);
  };
  const handleCountryFilter = (query: string) => {
    console.log("The country typed is ", query);
  };
  const handleCategoryFilter = (query: string) => {
    console.log("The category typed is ", query);
  };

  const handleCertificationFilter = (query: string) => {
    console.log("The certificate typed is ", query);
  };

  const filterProps = [
    {
      command: () => {},
      label: translationService(currentLanguage,'LAW.ADD.FORM.TITLE_OF_TEXT'),
    },
    {
      onChange: () => {},
      label: translationService(currentLanguage,'LAW.ADD.FORM.TYPE_OF_TEXT'),
    },
    {
      onChange: () => {},
      label: translationService(currentLanguage,'LAW.ADD.FORM.DATE_OF_ISSUE'),
    },
    {
      onChange: () => {},
      label: translationService(currentLanguage,'LAW.ANALYSE_TEXT.FORM.COMPLIANT'),
    },
    {
      onChange: () => {},
      label: translationService(currentLanguage,'LAW.ANALYSE_TEXT.FORM.IMPACT'),
    },
  ];

  const toast = useRef<Toast>(null);
  const onUpload = () => {
    toast?.current?.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
   fetchLaws().then(setLaws);
  };

  return (
    <LawContextProvider>
      <div className="w-full px-4">
        <BasicCard
          title={translationService(currentLanguage,'LAW.LIST.TITLE')}
          headerStyles="font-medium text-3xl py-4"
          content={() => (
            <>
              <Toast ref={toast}></Toast>
              <div className="filter my-8 w-full m-auto flex items-end">
                <div className="filter w-6/12">
                  <Filter fields={filterProps} title={translationService(currentLanguage,'LAWS.FILTER')} />
                </div>
                {!can(AppUserActions.ADD_LAW) ? null : (
                  <div className="flex justify-end gap-2 w-6/12">
                    {/*<button className='py-2.5 px-6 shadow-sm flex gap-3 items-center text-white bg-blue-500 rounded-md'>*/}
                    {/*  <i className='pi pi-file-excel'></i>*/}
                    {/*  Import*/}
                    {/*</button>*/}
                    <FileUpload mode="basic" name="file" url="http://localhost:3001/law/upload" onUpload={onUpload} accept=".csv, .xlsx" maxFileSize={1000000} auto chooseLabel={translationService(currentLanguage,'BUTTON.IMPORT')} />
                    {/*<button className='py-2.5 px-6 shadow-sm flex gap-3 items-center text-white bg-red-500 rounded-md'>*/}
                    {/*  <i className='pi pi-file-import'></i>*/}
                    {/*  Export*/}
                    {/*</button>*/}
                    <Button
                      title={translationService(currentLanguage,'BUTTON.NEW')}
                      styles="flex-row-reverse px-6 py-3.5 text-sm items-center rounded-full"
                      onClick={openAddLawForm}
                      Icon={{
                        Name: HiFolderAdd,
                        classes: "",
                        color: "white",
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="add-form my-10">
                <Dialog
                  header={translationService(currentLanguage,'LAW.ADD.FORM.TITLE')}
                  visible={visible}
                  style={{ width: "800px", maxWidth: "100%" }}
                  onHide={() => setVisible(false)}
                >
                  <AddLaw close={() => setVisible(false)} />
                </Dialog>
              </div>
              <Datatable
                data={laws}
                fields={[
                  "title_of_text",
                  "type_of_text",
                  "date_of_issue",
                  "applicability",
                  "compliant",
                  "impact",
                  "nature_of_impact",
                  "actions",
                ]}
                actionTypes={LawActionTypes}
                context={LawContext}
                accessControls={{
                  EDIT: AppUserActions.EDIT_LAW,
                  DELETE: AppUserActions.DELETE_LAW,
                  VIEW: AppUserActions.VIEW_LAW,
                }}
              />
            </>
          )}
          styles="px-6"
        />
      </div>
    </LawContextProvider>
  );
}

export default Laws;
