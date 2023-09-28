"use client";
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { fetchApi } from '@/utils/api';

interface PrimeReactTableProps { //Props para buscar las cargas del usuario
    usuario: string;
    conteo: string;
    codigo: string;
}

const PrimeReactTable = ({ usuario, conteo, codigo }: PrimeReactTableProps) => {
    const [dialogVisible, setDialogVisible] = useState<boolean>(false); //Para mostrar el dialogo
    const [responseFromApi, setResponseFromApi] = useState<any>(null); //Para cargar la tabla con la API

    useEffect(() => {

        const mostrar_tabla = async () => {
            try {
                const response = await fetchApi(`inventory/show?txt_usuario=${usuario}&sel_conteo=${conteo}`);
                setResponseFromApi(response);
            } catch (error) {
                //console.log("campo vacio");
            }
        };
        mostrar_tabla();
        
    }, [usuario, conteo, codigo]); //El codigo reacciona y se ejecuta mostrar_tabla();

    const dialogFooterTemplate = () => {
        return <Button label="Ok" icon="pi pi-check" onClick={() => setDialogVisible(false)} />;
    };

    return (

        <div>

            <Button label="Tabla" className="font-bold text-lg w-full py-2 rounded transition-colors" onClick={() => setDialogVisible(true)} />

            <div className="card" style={{ width: '85vw' }}>

                <Dialog 
                    header={
                        <span>
                            <i className="pi pi-search" /> Cargas
                        </span>
                    }
                    visible={dialogVisible}
                    style={{ width: '80vw' }}
                    maximizable
                    modal 
                    contentStyle={{ height: '600px' }}
                    onHide={() => setDialogVisible(false)}
                    footer={dialogFooterTemplate}>

                    <DataTable 
                        value={responseFromApi}
                        tableStyle={{ width: '65vw' }} 
                        className="flex flex-col justify-center items-center"                        
                        >

                        <Column
                            header="Datos"
                            field="codigo"
                            filter
                            filterMatchMode="contains"
                            filterPlaceholder="Buscar codigo"                            
                            body={(rowData) => (

                            <div>
                                <p><strong>Código:</strong> {rowData.codigo}</p>
                                <p><strong>Descripción:</strong> {rowData.descripcion}</p>
                                <p><strong>Cantidad:</strong> {rowData.cantidad}</p>
                            </div>

                        )}></Column>
                    </DataTable>
                </Dialog>
            </div>
        </div>
    ); 
}

PrimeReactTable.displayName = 'PrimeReactTable';

export default PrimeReactTable;