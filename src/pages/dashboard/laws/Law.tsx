import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import Filter from '../../../components/filter/Filter';
import Button from '../../../core/Button/Button';
import BasicCard from '../../../core/card/BasicCard';
import Datatable from '../../../core/table/Datatable';
import { Dialog } from 'primereact/dialog';
import AddLaw from './AddLaw';
import useAppContext from '../../../hooks/useAppContext.hooks';
import LawContextProvider, { LawContext } from '../../../contexts/LawContext';
import useLawContext from '../../../hooks/useLawContext';
import { ILaws } from '../../../interfaces/laws.interface';
import { LawActionTypes } from '../../../store/action-types/laws.actions';
import { createLaw, fetchLaws } from '../../../services/laws.service';
import { can } from '../../../utils/access-control.utils';
import { AppUserActions } from '../../../constants/user.constants';
import * as xlsx from 'xlsx';
import { Toast } from 'primereact/toast';
import { currentLanguageValue, translationService } from '../../../services/translation.service';
import { TabMenu } from 'primereact/tabmenu';
import { MenuItem } from 'primereact/menuitem';

function Laws() {
  const [laws, setLaws] = useState<ILaws[]>([]);
  const [archives, setArchives] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const { state } = useAppContext();
  const { state: LawState } = useLawContext();
  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');
  const toast = useRef<Toast>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

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
      // const archive = await getArchivedLaw();
      // setArchives([]);
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

  const items = [
    {label: translationService(currentLanguage,'ALL'), icon: 'pi pi-file'},
    {label: translationService(currentLanguage,'ARCHIVES'), icon: 'pi pi-briefcase'},
  ];

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
      label: translationService(currentLanguage,'LAW.ADD.FORM.COMPLIANT'),
    },
    {
      onChange: () => {},
      label: translationService(currentLanguage,'LAW.ADD.FORM.IMPACT'),
    },
  ];

  const sheetNames = ['identification', 'analyse_du_texte'];
  const onUpload = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if(!e.target.files) return;
    const reader = new FileReader();
    reader.onload = (e) => {

      const data = e.target?.result;
      const workbook = xlsx.read(data, { type: "array" });

      const identificationSheet = workbook.SheetNames.find(x => x === sheetNames[0]);
      const analyseDeTexteSheet = workbook.SheetNames.find(x => x === sheetNames[1]);

      if(!identificationSheet || !analyseDeTexteSheet) return;
      const identificationWorksheet = workbook.Sheets[identificationSheet];
      const identificationData = xlsx.utils.sheet_to_json(identificationWorksheet);

      const formattedIdentificationData:any[] = transformData(identificationData);
      const translatedIdentificationData:any[] = replaceParentsWithObjects(formattedIdentificationData);

      const analyseDuTexteWorksheet = workbook.Sheets[analyseDeTexteSheet];
      const analyseDuTexteData = xlsx.utils.sheet_to_json(analyseDuTexteWorksheet);

      const newAnalyseDuTexteData = analyseDuTexteData.map((obj: any) => {

        if(obj.PREUVES) {
          let name = obj.PREUVES.split(',');
          let img_url = obj.__EMPTY.split(',');

          const maxLength = Math.min(name.length, img_url.length);

          if(name.length > img_url.length) name.slice(0, maxLength);
          if(name.length < img_url.length) img_url.slice(0, maxLength);

          obj['PREUVES'] = name.map((x:string, index:number) => ({name: x, img_url: img_url[index]}));

          delete obj.__EMPTY;
        }
        return obj;
      })

      const formattedAnalyseDuTextData:any[] = transformData(newAnalyseDuTexteData);

      const finalData: any[] = formatAnalysisData(translatedIdentificationData, formattedAnalyseDuTextData);

      createLaw(finalData as unknown as ILaws).then(res => {
        if(res) {
          toast?.current?.show({ severity: 'success', summary: 'Success', detail: translationService(currentLanguage,'TOAST.SUCCESS.ACTION') });
          setLaws(res?.data ?? res);
        }else {
          toast?.current?.show({ severity: 'error', summary: 'Erruer', detail: translationService(currentLanguage,'TOAST.ERROR_ACTION') });
        }
      })
    };

    reader.readAsArrayBuffer(e.target.files[0]);

  };

  const formatAnalysisData = (array1:any[], array2: any[]) => {

    return array1.map((obj) => {
      obj['text_analysis'] = array2.filter(x => x.identification === obj.number);
      obj['is_analysed']= !!obj.text_analysis?.length;
      obj['is_achieved']=false;

      return obj;
    })
  };

  const displayMenuItems: MenuItem[] = [
    {label: 'All', icon: 'pi pi-fw pi-plus'},
    {label: 'Archives', icon: 'pi pi-fw pi-trash'}
  ];

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

          if(key === 'TYPE_DE_TEXTE'|| key === 'IMPACT' || key === 'APPLICABLE' || key === 'NATURE' || key === 'CONFORME'){
            acc[translationService(currentLanguage, `FILE_${key.toUpperCase()}`).toLowerCase()] = translationService(currentLanguage, `OPTIONS.${value[key].toUpperCase()}`);
          }
          else if(key === 'SECTEURS_ACTIVITE' || key === 'PROCESSUS_OU_DIRECTION' || key === 'PRODUITS_OU_SERVICES_CONCERNES'){
            let newValue = value[key].split(',');
            newValue = newValue.map((i: string) => key === 'PRODUITS_OU_SERVICES_CONCERNES' ? i :translationService(currentLanguage, `OPTIONS.${i.toUpperCase()}`));

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
        {/*translationService(currentLanguage,'LAW.LIST.TITLE')*/}
        <BasicCard
          title={''}
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
                        <i className='pi pi-cloud-upload'></i> &nbsp;
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

              <TabMenu className='tab-menu truncate' model={items} activeIndex={activeTab} onTabChange={(e) => {
                setActiveTab(e.index);
              }} />
              <div hidden={activeTab !== 0}>
                <Datatable
                  data={laws}
                  fields={[
                    "title_of_text",
                    "type_of_text",
                    "date_of_issue",
                    "is_analysed",
                    "nature_of_text",
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
              </div>

              <div hidden={activeTab !== 1}>
                {/*<Datatable*/}
                {/*  data={laws}*/}
                {/*  fields={[*/}
                {/*    "title_of_text",*/}
                {/*    "type_of_text",*/}
                {/*    "date_of_issue",*/}
                {/*    "applicability",*/}
                {/*    "compliant",*/}
                {/*    "actions",*/}
                {/*  ]}*/}
                {/*  actionTypes={LawActionTypes}*/}
                {/*  context={LawContext}*/}
                {/*  translationKey={'LAW.ADD.FORM'}*/}
                {/*  accessControls={{*/}
                {/*    EDIT: AppUserActions.EDIT_LAW,*/}
                {/*    DELETE: AppUserActions.DELETE_LAW,*/}
                {/*    VIEW: AppUserActions.VIEW_LAW,*/}
                {/*  }}*/}
                {/*/>*/}
              </div>
            </>
          )}
          styles="px-6"
        />
      </div>
    </LawContextProvider>
  );
}

export default Laws;
