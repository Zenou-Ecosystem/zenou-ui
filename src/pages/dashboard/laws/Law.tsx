import React, { ChangeEvent, useRef, useState } from 'react';
import Button from '../../../core/Button/Button';
import BasicCard from '../../../core/card/BasicCard';
import Datatable from '../../../core/table/Datatable';
import { LawContext } from '../../../contexts/LawContext';
import { ILawActions, LawActionTypes } from '../../../store/action-types/laws.actions';
import { can } from '../../../utils/access-control.utils';
import { AppUserActions } from '../../../constants/user.constants';
import * as xlsx from 'xlsx';
import { Toast } from 'primereact/toast';
import { currentLanguageValue, translationService } from '../../../services/translation.service';
import { TabMenu } from 'primereact/tabmenu';
import { MenuItem } from 'primereact/menuitem';
import { useNavigate } from 'react-router-dom';
import { FilterMatchMode } from 'primereact/api';
import { initialState } from '../../../store/state';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import httpHandlerService from '../../../services/httpHandler.service';

function Laws() {
  const laws = useSelector((state: typeof initialState) => state.laws);
  const dispatch = useDispatch<Dispatch<ILawActions>>();

  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');
  const toast = useRef<Toast>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const navigate = useNavigate();

  React.useMemo(()=>currentLanguageValue.subscribe(setCurrentLanguage), [currentLanguage]);

  const openAddLawForm = () => {
    navigate('/dashboard/laws/new')
  };

  const items = [
    {label: translationService(currentLanguage,'ALL'), icon: 'pi pi-file'},
    {label: translationService(currentLanguage,'ARCHIVES'), icon: 'pi pi-briefcase'},
  ];

  const sheetNames = ['identification', 'analyse_du_texte'];
  const onUpload = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if(!e.target.files) return;
    const reader = new FileReader();
    reader.onload = (e) => {

      const data = e.target?.result;
      const workbook = xlsx.read(data, { type: "array", cellText: true, cellDates: true });

      const identificationSheet = workbook.SheetNames.find(x => x === sheetNames[0]);
      const analyseDeTexteSheet = workbook.SheetNames.find(x => x === sheetNames[1]);

      if(!identificationSheet || !analyseDeTexteSheet) return;
      const identificationWorksheet = workbook.Sheets[identificationSheet];
      const identificationData = xlsx.utils.sheet_to_json(identificationWorksheet);

      const formattedIdentificationData:any[] = transformData(identificationData);
      const translatedIdentificationData:any[] = replaceParentsWithObjects(formattedIdentificationData);

      dispatch(
        httpHandlerService({
          endpoint: 'law',
          method: 'POST',
          data: translatedIdentificationData,
          showModalAfterRequest: true,
        }, LawActionTypes.ADD_MULTIPLE_LAWS) as any
      );
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
        if (obj.parent_of_text.length) {
          obj.parent_of_text = obj.parent_of_text.map((id:string) => lookup[id]);
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
          else if(key === 'SECTEURS_ACTIVITE' || key === 'PROCESSUS_OU_DIRECTION' || key === 'PRODUITS_OU_SERVICES_CONCERNES' || key === 'PARENT_DU_TEXTE'){
            let newValue = typeof value[key] === "number"? `${value[key]}`.split(',') : value[key].split(',');
            newValue = newValue.map((i: string) => {
              switch (key) {
                case 'PRODUITS_OU_SERVICES_CONCERNES':
                  return i;
                case 'PARENT_DU_TEXTE':
                  return Number(i)
                default:
                  return translationService(currentLanguage, `OPTIONS.${i.toUpperCase()}`)
            }});

            acc[translationService(currentLanguage, `FILE_${key.toUpperCase()}`).toLowerCase()] = newValue;
          }

          else {
            acc[translationService(currentLanguage, `FILE_${key.toUpperCase()}`).toLowerCase()] = value[key];
          }
          acc["requirements"] = [];
          acc["is_analysed"] = false;
          !acc['parent_of_text'] && (acc['parent_of_text'] = [])

          return acc;
        }, {})
      })
    }

  return (
    <div className="w-full px-4">
      {/*translationService(currentLanguage,'LAW.LIST.TITLE')*/}
      <BasicCard
        title={''}
        headerStyles="font-medium text-3xl py-4"
        content={() => (
          <>
            <Toast ref={toast}></Toast>
            <div className="my-6 w-full m-auto flex justify-between items-center">
              <div className="w-6/12">
                <h2 className='text-left text-2xl font-medium'>
                  {translationService(currentLanguage,'LAW.LIST.TITLE')}
                </h2>
              </div>
              {!can(AppUserActions.ADD_LAW) ? null : (
                <div className="flex justify-end gap-2 w-6/12">
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

            {/*<div className="add-form my-10">*/}
            {/*  <Dialog*/}
            {/*    header={translationService(currentLanguage,'LAW.ADD.FORM.TITLE')}*/}
            {/*    visible={visible}*/}
            {/*    style={{ width: "800px", maxWidth: "100%" }}*/}
            {/*    onHide={() => setVisible(false)}*/}
            {/*  >*/}
            {/*    <AddLaw setNewLaw={() => {*/}
            {/*      // fetchLaws().then(setLaws);*/}
            {/*      toast?.current?.show({ severity: 'success', summary: 'Success', detail: translationService(currentLanguage,'TOAST.SAVE_LAW_SUCCESS') });*/}
            {/*    } } close={() => setVisible(false)} />*/}
            {/*  </Dialog>*/}
            {/*</div>*/}

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
                  EDIT: LawActionTypes.EDIT_LAW,
                  DELETE: LawActionTypes.DELETE_LAW,
                  VIEW: LawActionTypes.VIEW,
                  ARCHIVE: LawActionTypes.ARCHIVE_LAW
                }}
                filterKeys={
                  {
                    "title_of_text": {value: null, matchMode: FilterMatchMode.CONTAINS},
                    "type_of_text": {value: null, matchMode: FilterMatchMode.CONTAINS},
                    "date_of_issue": {value: null, matchMode: FilterMatchMode.CONTAINS},
                    "is_analysed": {value: null, matchMode: FilterMatchMode.EQUALS},
                    "nature_of_text": {value: null, matchMode: FilterMatchMode.CONTAINS},
                  }
                }
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
  );
}

export default Laws;
