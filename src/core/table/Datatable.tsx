import React, { useEffect, useRef, useState } from "react";
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from "primereact/column";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { LocalStore } from "../../utils/storage.utils";
import { useNavigate } from "react-router-dom";
import { currentLanguageValue, translationService } from '../../services/translation.service';
import "./index.scss";
import { Menu } from 'primereact/menu';
import { ModalActionsTypes } from '../../store/action-types/modal.actions';
import { useDispatch } from 'react-redux';
import httpHandlerService from '../../services/httpHandler.service';

function Datatable(props: {
  data: any[];
  fields: string[];
  actionTypes: React.ReducerAction<any>;
  accessControls?: { EDIT?: string; VIEW?: string; DELETE?: string, ARCHIVE?: string };
  context: React.Context<any>;
  noPagination?: Boolean;
  translationKey?: string;
  filterKeys?:DataTableFilterMeta
  actions?:{ edit?: Function, read?: Function }
}) {
  const { data, fields, actionTypes, context, accessControls } = props;
  const [tableColumns, setTableColumns] = useState<string[]>([]);
  const actions: string[] = Object.values(actionTypes as any);

  const dispatch = useDispatch();

  const [tableData, setTableData] = useState([{}] as any);
  const toast = useRef({});
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');
  const menu = React.useRef<Menu | any>(null);
  const [currentData, setCurrentData] = React.useState<any>(null);
  const [filters, setFilters] = useState<DataTableFilterMeta>(props?.filterKeys ?? {});

  React.useMemo(()=>currentLanguageValue.subscribe(setCurrentLanguage), [currentLanguage]);

  let items = [
    { label: 'View', icon: "pi pi-fw pi-eye", command:() => {
        const data = LocalStore.get('VIEWED_DATA');
        const context = actions[0].split('_',);
        LocalStore.remove("action");
        navigate(`/dashboard/${context[context.length  - 1].toLowerCase()}/${data?.id || data?._id}`);
      }  },
    { label: 'Edit', icon: "pi pi-fw pi-file-edit",  command:() => {
        const context = actions[0].split('_',);
      const actionItem = actions.find((value) =>
          value.startsWith("EDIT")
        );
        LocalStore.set("EDIT_DATA", currentData)

        if(!props?.actions){
          navigate(`/dashboard/${context[context.length  - 1].toLowerCase()}/edit/${currentData?.id || currentData?._id}`);
          return;
        }
        if(props.actions.edit){
          props.actions.edit();
        }

        // console.log(actionItem, currentData);
      }  },
    { separator: true },
    { label: 'Delete', icon: "pi pi-fw pi-trash",  command:() => {
        console.log(actions);
        const actionItem = actions.find((value) =>
          value.startsWith("DELETE")
        );
        (actionItem) &&  requestDeleteConfirmation(actionItem, currentData);
      }  },
  ];

  accessControls?.ARCHIVE && items.splice(2,0, { label: 'Archive', icon: "pi pi-briefcase",  command:() => {
      const actionItem = actions.find((value) =>
        value.startsWith("ARCHIVE_LAW")
      );
      (actionItem) &&  requestDeleteConfirmation(actionItem, data);
    }  });

  const acceptDeletion = (action: string, payload: any) => {
    dispatch(
      httpHandlerService({
        endpoint: action.split('_')[1].toLowerCase(),
        method: 'DELETE',
        id: payload.id,
        showModalAfterRequest: true,
      }, action) as any
    );
  };

  const requestDeleteConfirmation = (action: string, payload: any) => {
    // remove the action in localStore to avoid remembering state in rowClickedHandler
    LocalStore.remove("action");
    dispatch({
      type: ModalActionsTypes.SHOW_MODAL,
      payload: {
        severity: 'DANGER',
        headerText: 'Do you want to continue?',
        bodyText: "Are you sure you want to continue with this action? This action is not reversible",
        actions: [
          {
            name: 'continue',
            onClick: () => {
              acceptDeletion(action, payload);
              dispatch({
                type: ModalActionsTypes.HIDE_MODAL
              })
            }
          }
        ]
      }
      });
  };

  useEffect(() => {
    setTableData(data);
    let columns = data && data.length >= 1 ? [...Object.keys(data[0]), 'Actions'] : [];
    setTableColumns(columns);
  }, [data]);

  const rowClickedHandler = (e: any) => {
    if("originalEvent" in e && "data" in e){
      const data = e.data;
      LocalStore.set("EDIT_DATA", {data, index: e.index})
      LocalStore.set("VIEWED_DATA", data);
    }
  };

  const simpleArrayBodyTemplate = (key:string) => (rowData:any) => {
    return <ul>
      {
        rowData[key].map((item: string, index:number) => {
          return <li key={index}>{
            translationService(currentLanguage, `OPTIONS.SECTORS_OF_ACTIVITIES.${item.toUpperCase()}`) === 'no such key' ? item :
              translationService(currentLanguage, `OPTIONS.SECTORS_OF_ACTIVITIES.${item.toUpperCase()}`)
          }</li>
        } )
      }
    </ul>
  }

  const simpleTranslation = (key:string, translationKey: string) => (rowData:any) => {
    return <div> {translationService(currentLanguage, `${translationKey}.${rowData[key]?.toString()?.toUpperCase()}`)}</div>
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
        filters={filters}
        filterDisplay="row"
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
                      body={( data ) => <span className="flex justify-end items-center gap-2 text-xl">
                            <i onClick={(e) => {
                              menu.current.toggle(e);
                              setCurrentData(data);
                            }} className='pi p-2 rounded-md pi-ellipsis-v text-gray-500 cursor-pointer'></i>
                            <Menu model={items} popup ref={menu} id="dropdown" />
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
                    filter={!!props?.filterKeys}
                    filterPlaceholder={`Filtré par ${key}`}
                    body={
                    ['department', 'sector_of_activity'].includes(key) ? simpleArrayBodyTemplate('department' || 'sector_of_activity')
                      : key === 'is_analysed' ? simpleTranslation('is_analysed', 'OPTIONS') :
                        key === 'type_of_text' ? simpleTranslation('type_of_text', 'OPTIONS') :''
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
