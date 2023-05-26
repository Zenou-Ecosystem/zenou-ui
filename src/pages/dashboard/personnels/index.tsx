import { useEffect, useRef, useState } from 'react';
import Filter from "../../../components/filter/Filter";
import Button from "../../../core/Button/Button";
import BasicCard from "../../../core/card/BasicCard";
import Datatable from "../../../core/table/Datatable";
import { Dialog } from "primereact/dialog";
import AddPersonnel from "./AddPersonnel";
import { HiPlus } from "react-icons/hi";
import useAppContext from "../../../hooks/useAppContext.hooks";
import { can } from "../../../utils/access-control.utils";
import { AppUserActions } from "../../../constants/user.constants";
import { fetchAllPersonnel } from "../../../services/personnel.service";
import { IPersonnel } from "../../../interfaces/personnel.interface";
import usePersonnelContext from "../../../hooks/usePersonnelContext";
import PersonnelContextProvider, {
  PersonnelContext,
} from "../../../contexts/PersonnelContext";
import { PersonnelActionTypes } from "../../../store/action-types/personnel.actions";
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';

function Personnel() {
  const [personnel, setPersonnel] = useState<IPersonnel[]>([]);
  const [visible, setVisible] = useState(false);
  const { state } = useAppContext();

  const { state: PersonnelState } = usePersonnelContext();

  const openAddPersonnelForm = () => {
    setVisible(true);
  };

  useEffect(() => {
    (async () => {
      const res = await state;
      let data = res?.data;
      if (!data || data?.length < 1) {
        data = await fetchAllPersonnel();
      }
      setPersonnel(data);
    })();

    (async () => {
      const allPersonnel = await fetchAllPersonnel();
      console.log(allPersonnel);
    })();

    (async () => {
      const resolvedLawState = await PersonnelState;
      if (resolvedLawState.hasCreated) {
        console.log("setPersonnel state changed => ", resolvedLawState);
        setVisible(false);
      }
    })();
  }, [state, PersonnelState]);

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
      type: "text",
      onChange: handleNameFilter,
      placeholder: "Name",
    },
    {
      type: "text",
      onChange: handleCountryFilter,
      placeholder: "Country",
    },
    {
      type: "text",
      onChange: handleCategoryFilter,
      placeholder: "Category",
    },
    {
      type: "text",
      onChange: handleCertificationFilter,
      placeholder: "Certification",
    },
  ];
  return (
    <PersonnelContextProvider>
      {/* <div className="w-full px-4 my-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <BasicCard {...cardProps} />
                <BasicCard {...cardProps} />
                <BasicCard {...cardProps} />
                <BasicCard {...cardProps} />
            </div> */}

      <div className="w-full px-4">
        <BasicCard
          title="List of employees"
          headerStyles="font-medium text-3xl py-4"
          content={() => (
            <>
              <div className="filter my-8 w-full m-auto flex items-end">
                <div className="filter w-6/12">
                  <Filter fields={filterProps} title="Filter employees" />
                </div>
                {!can(AppUserActions.ADD_PERSONNEL) ? null : (
                  <div className="flex justify-end gap-2 w-6/12">
                   <button className='py-2.5 px-6 shadow-sm flex gap-3 items-center text-white bg-red-500 rounded-md'>
                      <i className='pi pi-file-import'></i>
                      Export
                    </button>
                    <Button
                      title="New"
                      styles="flex-row-reverse px-6 py-3.5 items-center rounded-full"
                      onClick={openAddPersonnelForm}
                      Icon={{
                        Name: HiPlus,
                        classes: "",
                        color: "white",
                      }}
                    />
                  </div>
                )}
              </div>
              {/*<div className="my-4 w-full m-auto flex items-center">*/}
              {/*  <div className="filter w-10/12">*/}
              {/*    <Filter fields={filterProps} title="Filter laws" />*/}
              {/*  </div>*/}
              {/*  {!can(AppUserActions.ADD_PERSONNEL) ? null : (*/}
              {/*    <div className="add-btn">*/}
              {/*      <Button*/}
              {/*        title="New"*/}
              {/*        styles="flex justify-around flex-row-reverse items-center rounded-full"*/}
              {/*        onClick={openAddPersonnelForm}*/}
              {/*        Icon={{*/}
              {/*          Name: HiPlus,*/}
              {/*          classes: "",*/}
              {/*          color: "white",*/}
              {/*        }}*/}
              {/*      />*/}
              {/*    </div>*/}
              {/*  )}*/}
              {/*</div>*/}

              <div className="add-form my-10">
                <Dialog
                  header="Create new employee"
                  visible={visible}
                  style={{ width: "770px", maxWidth: "100%" }}
                  onHide={() => setVisible(false)}
                >
                  <AddPersonnel />
                </Dialog>
              </div>

              <Datatable
                data={personnel}
                fields={["username", "email", "role", "Actions"]}
                actionTypes={PersonnelActionTypes}
                context={PersonnelContext}
                accessControls={{
                  EDIT: AppUserActions.EDIT_PERSONNEL,
                  DELETE: AppUserActions.DELETE_PERSONNEL,
                  VIEW: AppUserActions.VIEW_PERSONNEL,
                }}
              />
            </>
          )}
          styles="px-6"
        />
      </div>
    </PersonnelContextProvider>
  );
}

export default Personnel;
