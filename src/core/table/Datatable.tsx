import React, { useContext, useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { HiEye, HiPencilAlt, HiTrash } from 'react-icons/hi';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';



function Datatable(props: {
    data: any[], fields: string[],
    actionTypes: React.ReducerAction<any>, context: React.Context<any>
}) {

    const { data, fields, actionTypes, context } = props;
    const actions = Object.keys(actionTypes as any);
    const { state, dispatch } = useContext(context);
    const [tableDate, setTableData] = useState([{}] as any);
    const toast = useRef({});

    const acceptDeletion = (action: string, payload: any) => {
        dispatch({ type: action, payload: payload?.id });
        const filtered = tableDate.filter((item: any) => item.id != payload.id);
        setTableData(filtered);

        (toast.current as any).show(
            {
                severity: 'info',
                summary: 'Confirmed',
                detail: 'Record successfully deleted', life: 3000
            });
    }

    const reject = () => {
        (toast.current as any).show(
            {
                severity: 'warn',
                summary: 'Rejected',
                detail: 'Record not deleted', life: 3000
            });
    }

    const requestDeleteConfirmation = (action: string, payload: any) => {
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: () => acceptDeletion(action, payload),
            reject
        });
    };


    useEffect(() => {
        setTableData(data);
    }, [data]);

    const actionHandler = (e: any, action: string) => {
        e.preventDefault();
        localStorage.setItem('action', action.toUpperCase());
    }

    const rowClickedHandler = (e: any) => {
        const data = e.data;

        // Using this simple trick to replace useState
        // This helps as one doesn't have to click the action buttons twice
        let clickedAction = localStorage.getItem('action') ?? '';

        switch (clickedAction) {

            case "VIEW":
                const item = actions.find(value => value.startsWith(clickedAction));
                if (item && data) {
                    dispatch({ type: item, payload: data?.id ?? data });
                }
                return;

            case "EDIT":
                const actionType = actions.find(value => value.startsWith(clickedAction));
                if (actionType && data) {
                    dispatch({ type: actionType, payload: data });
                }
                return;

            case "DELETE":
                const actionItem = actions.find(value => value.startsWith(clickedAction));
                if (actionItem) {
                    requestDeleteConfirmation(actionItem, data);
                }
                return;

            default:
                break;
        }
    }

    return (
        <div className="card">
            <Toast ref={toast as any} />
            <ConfirmDialog />
            <DataTable value={tableDate} paginator rows={5}
                stripedRows
                rowsPerPageOptions={[5, 10, 25, 50]}
                sortMode="multiple" onRowClick={(e) => rowClickedHandler(e)} style={{ cursor: 'pointer' }}>
                {
                    data.length > 1 ? Object.keys(data[0]).filter(key => {
                        return fields.map(field => field.toLowerCase()).includes(key.toLowerCase())
                    }).map((key: string, index: number) => {
                        return (
                            <Column key={index} field={key} header={key.toUpperCase()} sortable style={{ width: '25%' }}>
                            </Column>
                        )
                    }) : null
                }

                <Column header="Action" body={
                    <span className="flex justify-around items-center gap-2 text-xl">
                        <span onClick={(e) => actionHandler(e, 'view')}><HiEye className="text-yellow-600" /></span>
                        <span onClick={(e) => actionHandler(e, 'edit')}><HiPencilAlt className="text-primary" /></span>
                        <span onClick={(e) => actionHandler(e, 'delete')}><HiTrash className="text-red-600" /></span>
                    </span>
                }>

                </Column>
            </DataTable>
        </div>
    );
}

export default Datatable;