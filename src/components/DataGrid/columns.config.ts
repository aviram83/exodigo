import type { ColDef } from 'ag-grid-community'

export const columnDefs: ColDef[] = [
  { field: 'name', headerName: 'Name', flex: 1, sortable: true, resizable: true },
  { field: 'colorLabel', headerName: 'Type', width: 140, sortable: true, resizable: true },
  { field: 'startPoint', headerName: 'Start Point', width: 140, sortable: true, resizable: true },
  { field: 'endPoint', headerName: 'End Point', width: 140, sortable: true, resizable: true },
  { field: 'tags', headerName: 'Tags', width: 180, sortable: true, resizable: true }
]

export default columnDefs
