import React, { useEffect, useRef, useState } from 'react';
import { fecthCompanies } from "../../../services/companies.service";
import Filter from "../../../components/filter/Filter";
import Button from "../../../core/Button/Button";
import BasicCard from "../../../core/card/BasicCard";
import Datatable from "../../../core/table/Datatable";
import { Dialog } from "primereact/dialog";
import { ICompany } from "../../../interfaces/company.interface";
import AddCompany from "./AddCompany";
import { HiPlus } from "react-icons/hi";
import useAppContext from "../../../hooks/useAppContext.hooks";
import CompanyContextProvider, {
  CompanyContext,
} from "../../../contexts/CompanyContext";
import useCompanyContext from "../../../hooks/useCompanyContext";
import { CompanyActionTypes } from "../../../store/action-types/company.actions";
import { can } from "../../../utils/access-control.utils";
import { AppUserActions } from "../../../constants/user.constants";
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { currentLanguageValue, translationService } from '../../../services/translation.service';
import EditCompany from './EditCompanies';

function CompaniesList() {
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const { state, dispatch } = useAppContext();

  const { state: companyState, dispatch: companyDispatch } =
    useCompanyContext();

  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');

  React.useMemo(()=>currentLanguageValue.subscribe(setCurrentLanguage), [currentLanguage]);

  const openAddCompanyForm = () => {
    setVisible(true);
  };

  useEffect(() => {
    (async () => {
      setCompanies(await fecthCompanies());
    })();

    // (async () => {
    //   const resolvedCompanyState = await companyState;
    //   if (resolvedCompanyState.hasCreated) {
    //     console.log("Company state changed => ", resolvedCompanyState);
    //     setVisible(false);
    //   }
    // })();
  }, []);

  return (
    <CompanyContextProvider>
      <div className="w-full px-4">
        <BasicCard
          title={''}
          headerStyles="font-medium text-3xl py-4"
          content={() => (
            <>
              <div className="my-6 w-full m-auto flex justify-between items-center">
                <div className="w-6/12">
                  <h2 className='text-left text-2xl font-medium'>
                    {translationService(currentLanguage,'COMPANIES.LIST.TITLE')}
                  </h2>
                </div>
                {!can(AppUserActions.ADD_COMPANY) ? null : (
                  <div className="flex justify-end gap-2 w-6/12">
                    {/*<button className='py-2.5 px-6 shadow-sm flex gap-3 items-center text-white bg-red-500 rounded-md'>*/}
                    {/*  <i className='pi pi-file-import'></i>*/}
                    {/*  Export*/}
                    {/*</button>*/}
                    <Button
                      title={translationService(currentLanguage,'BUTTON.NEW')}
                      styles="flex-row-reverse px-6 py-3.5 items-center rounded-full"
                      onClick={openAddCompanyForm}
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
              {/*  {!can(AppUserActions.ADD_COMPANY) ? null : (*/}
              {/*    <div className="add-btn w-2/12">*/}
              {/*      <Button*/}
              {/*        title="New"*/}
              {/*        styles="flex justify-around flex-row-reverse items-center rounded-full"*/}
              {/*        onClick={openAddCompanyForm}*/}
              {/*        Icon={{*/}
              {/*          Name: HiPlus,*/}
              {/*          classes: "",*/}
              {/*          color: "white",*/}
              {/*        }}*/}
              {/*      />*/}
              {/*    </div>*/}
              {/*  )}*/}
              {/*  <div className="filter w-10/12">*/}
              {/*    <Filter fields={filterProps} title="Filter Companies" />*/}
              {/*  </div>*/}
              {/*</div>*/}

              <div className="add-form my-10">
                <Dialog
                  header={translationService(currentLanguage,'BUTTON.NEW')}
                  visible={visible}
                  style={{ width: "680px", maxWidth: "100%" }}
                  onHide={() => setVisible(false)}
                >
                  <AddCompany
                    hideAction={() => setVisible(false)}
                    stateGetter={() => fecthCompanies().then(setCompanies)}
                  />
                </Dialog>

                <Dialog
                  header={translationService(currentLanguage,'BUTTON.NEW')}
                  visible={editVisible}
                  style={{ width: "680px", maxWidth: "100%" }}
                  onHide={() => setEditVisible(false)}
                >
                  <EditCompany
                    hideAction={() => setEditVisible(false)}
                    stateGetter={() => fecthCompanies().then(setCompanies)}
                  />
                </Dialog>

              </div>

              <Datatable
                data={companies}
                fields={[
                  "name",
                  "admin_email",
                  "function",
                  "contact",
                  "capital",
                  "actions",
                ]}
                actionTypes={CompanyActionTypes}
                context={CompanyContext}
                translationKey={"REGISTRATION.FORM"}
                actions={{edit: () => setEditVisible(true)}}
                accessControls={{
                  EDIT: AppUserActions.EDIT_COMPANY,
                  DELETE: AppUserActions.DELETE_COMPANY,
                  VIEW: AppUserActions.VIEW_COMPANY,
                }}
              />
            </>
          )}
          styles="px-6"
        />
      </div>
    </CompanyContextProvider>
  );
}

export default CompaniesList;
