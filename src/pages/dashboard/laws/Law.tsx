import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
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
import * as xlsx from 'xlsx';
import { Toast } from 'primereact/toast';
import { currentLanguageValue, translationService } from '../../../services/translation.service';

function Laws() {
  const [laws, setLaws] = useState<ILaws[]>([]);
  const [visible, setVisible] = useState(false);
  const { state } = useAppContext();
  const { state: LawState } = useLawContext();
  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');
  const toast = useRef<Toast>(null);

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

  const onUpload = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if(!e.target.files) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = xlsx.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = xlsx.utils.sheet_to_json(worksheet);

      console.log(workbook.SheetNames);

      let formattedData:any[] = transformData(json);

      replaceParentsWithObjects(formattedData);
    };

    reader.readAsArrayBuffer(e.target.files[0]);

  };

    const replaceParentsWithObjects = (array:any[]) => {
      // First, create a lookup table for all the objects in the array
      const lookup:any = {};
      array.forEach(obj => {
        lookup[obj.number] = obj;
      });

      // Then, iterate through the array and replace "parent_of_text" values with the corresponding objects
      array.forEach(obj => {
        if (obj.parent_of_text !== undefined && lookup[obj.parent_of_text] !== undefined) {
          obj.parent_of_text = lookup[obj.parent_of_text];
        }
      });

      return array;
    }

    const transformData = (array: any[]) => {
      return array.map(value => {
        return Object.keys(value).reduce((acc:Record<string, any>, key) => {

          if(key === 'TYPE_DE_TEXTE'){
            acc[translationService(currentLanguage, `FILE_${key.toUpperCase()}`).toLowerCase()] = translationService(currentLanguage, `OPTIONS.${value[key].toUpperCase()}`);
          }
          else if(key === 'SECTEURS_ACTIVITE'){
            let newValue = value[key].split(',');
            newValue = newValue.map((i: string) => translationService(currentLanguage, `OPTIONS.${i.toUpperCase()}`));

            acc[translationService(currentLanguage, `FILE_${key.toUpperCase()}`).toLowerCase()] = newValue;
          }
          else {
            acc[translationService(currentLanguage, `FILE_${key.toUpperCase()}`).toLowerCase()] = value[key];
          }

          return acc;
        }, {})
      })
    }

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
                    <div className='file-container'>
                      <label htmlFor='file-input'>
                        <i className='pi pi-upload'></i> &nbsp;
                        {translationService(currentLanguage,'BUTTON.IMPORT')}
                      </label>
                      <input type="file" onChange={onUpload} id="file-input" accept=".xlsx" />
                    </div>

                    <Button
                      title={translationService(currentLanguage,'BUTTON.NEW')}
                      styles="flex-row-reverse px-6 py-3.5 text-sm items-center rounded-full"
                      onClick={openAddLawForm}
                      Icon={{
                        Name: () => (<i className='pi pi-plus text-white' />),
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
                  <AddLaw setNewLaw={() => {
                    fetchLaws().then(setLaws);
                    toast?.current?.show({ severity: 'success', summary: 'Success', detail: translationService(currentLanguage,'TOAST.SAVE_LAW_SUCCESS') });
                  } } close={() => setVisible(false)} />
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
                  // "impact",
                  // "nature_of_impact",
                  "actions",
                ]}
                actionTypes={LawActionTypes}
                context={LawContext}
                translationKey={'LAW.ADD.FORM'}
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
