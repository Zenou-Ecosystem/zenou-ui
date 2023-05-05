import React, { useContext, useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { HiEye, HiPencilAlt, HiTrash } from "react-icons/hi";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { LocalStore } from "../../utils/storage.utils";
import { useNavigate } from "react-router-dom";
import { can } from "../../utils/access-control.utils";
// import "./index.scss";

function Datatable(props: {
  data: any[];
  fields: string[];
  actionTypes: React.ReducerAction<any>;
  accessControls: { EDIT: string; VIEW: string; DELETE: string };
  context: React.Context<any>;
}) {
  const { data, fields, actionTypes, context, accessControls } = props;
  const [tableColumns, setTableColumns] = useState<string[]>([]);
  const actions = Object.keys(actionTypes as any);
  const { state, dispatch } = useContext(context);
  const [tableData, setTableData] = useState([{}] as any);
  const toast = useRef({});
  const navigate = useNavigate();

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
    setTableData(data);
    let columns = data && data.length > 1 ? Object.keys(data[0]) : [];
    columns.push("Actions");
    setTableColumns(columns);
  }, [data]);

  const actionHandler = (e: any, action: string) => {
    e.preventDefault();
    // this trick allows for state remembrance in rowClickedHandler
    LocalStore.set("action", action.toUpperCase());
  };

  const rowClickedHandler = (e: any) => {
    const data = e.data;
    // Using this simple trick to replace useState
    // This helps as one doesn't have to click the action buttons twice
    let clickedAction = LocalStore.get("action");
    switch (clickedAction) {
      case "VIEW":
        const item = actions.find((value) => value.startsWith(clickedAction));
        if (item && data) {
          // dispatch({ type: item, payload: data?.id ?? data });
          LocalStore.set("VIEWED_DATA", data);
          LocalStore.remove("action");
          navigate("/dashboard/data/" + data?.id);
        }
        break;

      case "EDIT":
        const actionType = actions.find((value) =>
          value.startsWith(clickedAction)
        );
        if (actionType && data) {
          dispatch({ type: actionType, payload: data });
        }
        break;

      case "DELETE":
        const actionItem = actions.find((value) =>
          value.startsWith(clickedAction)
        );
        if (actionItem) {
          requestDeleteConfirmation(actionItem, data);
          break;
        }
        break;

      default:
        break;
    }
  };

  return (
    <div className="">
      <Toast ref={toast as any} />
      <ConfirmDialog />
      <DataTable
        value={tableData}
        paginator
        rows={5}
        stripedRows
        rowsPerPageOptions={[5, 10, 25, 50]}
        sortMode="multiple"
        onRowClick={(e) => rowClickedHandler(e)}
        style={{ cursor: "pointer" }}
      >
        {tableColumns.length > 1
          ? tableColumns
              .filter((key) => {
                return fields
                  .map((field) => field.toLowerCase())
                  .includes(key.toLowerCase());
              })
              .map((key: string, index: number) => {
                if (key.toLowerCase().startsWith("action")) {
                  return (
                    <Column
                      header={key}
                      key={index}
                      body={
                        <span className="flex justify-around items-center gap-2 text-xl">
                          {!can(accessControls.VIEW) ? null : (
                            <span onClick={(e) => actionHandler(e, "view")}>
                              <HiEye className="text-yellow-600" />
                            </span>
                          )}
                          {!can(accessControls.EDIT) ? null : (
                            <span onClick={(e) => actionHandler(e, "edit")}>
                              <HiPencilAlt className="text-primary" />
                            </span>
                          )}
                          {!can(accessControls.DELETE) ? null : (
                            <span onClick={(e) => actionHandler(e, "delete")}>
                              <HiTrash className="text-red-600" />
                            </span>
                          )}
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
                    header={key.toUpperCase().replaceAll("_", " ")}
                    sortable
                    style={{ width: "5%" }}
                  ></Column>
                );
              })
          : null}
      </DataTable>
    </div>
  );
}

export default Datatable;
