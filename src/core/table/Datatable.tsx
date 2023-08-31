import React, { useContext, useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { LocalStore } from "../../utils/storage.utils";
import { useNavigate } from "react-router-dom";
import { can } from "../../utils/access-control.utils";
import { currentLanguageValue, translationService } from '../../services/translation.service';
import "./index.scss";
import { classNames } from 'primereact/utils';
import { AppUserActions } from '../../constants/user.constants';
import { Menu } from 'primereact/menu';

function Datatable(props: {
  data: any[];
  fields: string[];
  actionTypes: React.ReducerAction<any>;
  accessControls: { EDIT: string; VIEW: string; DELETE: string };
  context: React.Context<any>;
  noPagination?: Boolean;
  translationKey?: string;
}) {
  const { data, fields, actionTypes, context, accessControls } = props;
  const [tableColumns, setTableColumns] = useState<string[]>([]);
  const actions = Object.keys(actionTypes as any);
  const { dispatch } = useContext(context);
  const [tableData, setTableData] = useState([{}] as any);
  const toast = useRef({});
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');
  const menu = React.useRef<Menu | any>(null);

  React.useMemo(()=>currentLanguageValue.subscribe(setCurrentLanguage), [currentLanguage]);

  let items = [
    { label: 'View', icon: "pi pi-fw pi-eye", command:() => {
        const data = LocalStore.get('VIEWED_DATA');
        const context = actions[0].split('_',);
        LocalStore.remove("action");
        navigate(`/dashboard/${context[context.length  - 1].toLowerCase()}/${data?.id || data?._id}`);
      }  },
    { label: 'Edit', icon: "pi pi-fw pi-file-edit",  command:() => {

      }  },
    { label: 'Archive', icon: "pi pi-briefcase",  command:() => {
        const actionItem = actions.find((value) =>
          value.startsWith("ARCHIVE_LAW")
        );
        (actionItem) &&  requestDeleteConfirmation(actionItem, data);
      }  },
    { separator: true },
    { label: 'Delete', icon: "pi pi-fw pi-trash",  command:() => {
        const actionItem = actions.find((value) =>
          value.startsWith("DELETE")
        );
        (actionItem) &&  requestDeleteConfirmation(actionItem, data);
      }  },
  ];
  // if(can(AppUserActions.VIEW_COMPANY)){
  //   items.splice(2, 0, { label: translationService(currentLanguage,'DASHBOARD.SIDEBAR.NAVIGATION.COMPANIES'), icon: "pi pi-building",  command:() => navigate('/dashboard/company')  })
  // }

  const acceptDeletion = (action: string, payload: any) => {
    dispatch({ type: action, payload: payload?.id });
    const filtered = tableData.filter((item: any) => item.id !== payload.id);
    setTableData(filtered);

    (toast.current as any).show({
      severity: "info",
      summary: "Confirmed",
      detail: "Record successfully deleted",
      life: 3000,
    });
  };

  const reject = () => {
    (toast.current as any).show({
      severity: "warn",
      summary: "Rejected",
      detail: "Record not deleted",
      life: 3000,
    });
  };

  const requestDeleteConfirmation = (action: string, payload: any) => {
    // remove the action in localstore to avoid remembering state in rowClickedHandler
    LocalStore.remove("action");
    confirmDialog({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: () => acceptDeletion(action, payload),
      reject,
    });
  };

  useEffect(() => {
    setTableData(data?.map((item) => {
      item?.type_of_text && (item["type_of_text"] = translationService(currentLanguage,`OPTIONS.${item.type_of_text.toUpperCase()}`))
      item?.applicability && (item["applicability"] = translationService(currentLanguage,`OPTIONS.${item?.applicability.toString().toUpperCase()}`));
      item?.impact && (item["impact"] = translationService(currentLanguage,`OPTIONS.${item.impact?.toString().toUpperCase()}`));
      item?.nature_of_impact && (item["impact"] = translationService(currentLanguage,`OPTIONS.${item.impact?.toString().toUpperCase()}`));
      item?.compliant && (item["compliant"] = translationService(currentLanguage,`OPTIONS.${item.compliant?.toString().toUpperCase()}`));

      return item;
    })||data);
    let columns = data && data.length >= 1 ? [...Object.keys(data[0]), 'Actions'] : [];
    setTableColumns(columns);
  }, [data]);

  const rowClickedHandler = (e: any) => {

    if("originalEvent" in e && "data" in e){
      let context = e.originalEvent.target.title;
      const data = e.data;
      LocalStore.set("EDIT_DATA", {data, index: e.index})
      LocalStore.set("VIEWED_DATA", data);

      // switch (true) {
      //   case context === "view":
      //     if (data) {
      //       LocalStore.set("VIEWED_DATA", data);
      //       LocalStore.remove("action");
      //       context = actions[0].split('_',);
      //       navigate(`/dashboard/${context[context.length  - 1].toLowerCase()}/${data?.id}`);
      //     }
      //     break;
      //
      //   case context === 'edit':
      //     LocalStore.set("EDIT_DATA", {data, index: e.index})
      //     break;
      //
      //   case context === 'delete':
      //     const actionItem = actions.find((value) =>
      //             value.startsWith("DELETE")
      //           );
      //     (actionItem) &&  requestDeleteConfirmation(actionItem, data);
      //     break;
      // }
    }
  };

  const simpleArrayBodyTemplate = (key:string) => (rowData:any) => {
    return <ul>
      {
        rowData[key].map((item: string) => {
          return <li key={item}>{translationService(currentLanguage, `OPTIONS.SECTORS_OF_ACTIVITIES.${item.toUpperCase()}`)}</li>
        } )
      }
    </ul>
  }

  return (
    <div className="">
      <Toast ref={toast as any} />
      <ConfirmDialog />
      <DataTable
        value={tableData}
        emptyMessage={translationService(currentLanguage,'TABLE.NO_RESULT_FOUND')}
        paginator={!props.noPagination}
        rows={5}
        stripedRows
        showGridlines
        rowsPerPageOptions={[5, 10, 25, 50]}
        sortMode="multiple"
        onRowClick={rowClickedHandler}
        className="border my-8 text-center rounded-md overflow-y-hidden text-gray-500"
      >
        {tableColumns.length
          ? tableColumns
              .filter((key) => {
                return fields
                  .map((field) => {
                    return field.toLowerCase();
                  })
                  .includes(key.toLowerCase());
              })
              .map((key: string, index: number) => {
                if (key.toLowerCase().startsWith("action")) {
                  return (
                    <Column
                      header={key}
                      key={index}
                      body={
                        <span className="flex justify-end items-center gap-2 text-xl">
                            <i onClick={(e) => menu.current.toggle(e)} className='pi p-2 rounded-md pi-ellipsis-v text-gray-500 cursor-pointer'></i>
                            <Menu model={items} popup ref={menu} id="dropdown" />
                          {/* {!can(accessControls.VIEW) ? null:*/}
                          {/*   (*/}
                          {/*     <i className='pi border p-2 border-blue-500 rounded-md bg-blue-50 pi-eye text-blue-500 cursor-pointer' title='view'></i>*/}
                          {/*   )*/}
                          {/* }*/}
                          {/*{!can(accessControls.EDIT) ? null:*/}
                          {/*  (*/}
                          {/*    <i className='pi p-2 border border-green-500 rounded-md bg-green-50 pi-pencil text-green-500 cursor-pointer' title='edit'></i>*/}
                          {/*  )*/}
                          {/*}*/}
                          {/*{!can(accessControls.DELETE) ? null:*/}
                          {/*  (*/}
                          {/*    <i className='pi p-2 border border-red-500 rounded-md bg-red-50 pi-trash text-red-500 cursor-pointer' title='delete'></i>*/}
                          {/*  )*/}
                          {/*}*/}
                          {/*{!can(accessControls.DELETE) ? null:*/}
                          {/*  (*/}
                          {/*    <i className='pi p-2 border border-gray-500 rounded-md bg-gray-50 pi-briefcase text-gray-500 cursor-pointer' title='delete'></i>*/}
                          {/*  )*/}
                          {/*}*/}

                        </span>
                      }
                      style={{ width: "5%" }}
                    ></Column>
                  );
                }

                return (
                  <Column
                    key={index}
                    field={key}
                    header={props.translationKey ? translationService(currentLanguage,`${props.translationKey}.${key.toUpperCase()}`): key}
                    sortable
                    body={
                    ['department', 'sector_of_activity'].includes(key) ? simpleArrayBodyTemplate('department' || 'sector_of_activity') : ''
                    }
                    style={{ width: "5%", textTransform: "capitalize" }}
                  ></Column>
                );
              })
          : null}
      </DataTable>
    </div>
  );
}

export default Datatable;
