import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';



function Datatable(props: { data: any[], fields: string[] }) {
    const { data, fields } = props;
    return (
        <div className="card">
            <DataTable value={data} paginator rows={5}
                stripedRows
                rowsPerPageOptions={[5, 10, 25, 50]}
                sortMode="multiple">
                {
                    data.length > 1 ? Object.keys(data[0]).filter(key => {
                        return fields.map(field => field.toLowerCase()).includes(key.toLowerCase())
                    }).map((key: string, index: number) => {
                        return (<Column key={index} field={key} header={key.toUpperCase()} sortable style={{ width: '25%' }}>
                        </Column>)
                    }) : null
                }
            </DataTable>
        </div>
    );
}

export default Datatable;