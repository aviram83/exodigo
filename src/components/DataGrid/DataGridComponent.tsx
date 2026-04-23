import React, { useMemo, useRef, useEffect, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import './DataGrid.css'
import { columnDefs } from './columns.config'

type Props = {
  rows: Array<any>
  onSelect?: (name: string) => void
  selectedId?: string | number | null
  availableTags?: string[]
}

const DataGridComponent: React.FC<Props> = ({ rows, onSelect, selectedId }) => {
  const gridRef = useRef<any>(null)

    const defaultColDef = useMemo(() => ({ sortable: true, filter: false, resizable: true }), [])

  // filter out invalid/empty entries from mock data and add formatted start/end
  const rowData = useMemo(
    () =>
      rows
        .filter((r) => r && typeof r.name === 'string' && r.name.length > 0)
        .map((r) => ({
          name: r.name,
          colorLabel: r.color?.label || '',
          colorHex: r.color?.hex || '',
          startPoint: r.startPoint ? `${r.startPoint.lat}, ${r.startPoint.lon}` : '',
          endPoint: r.endPoint ? `${r.endPoint.lat}, ${r.endPoint.lon}` : '',
          tags: (r.tags || []).join(', ')
        })),
    [rows]
  )

  // (no column filters) — using centralized `columnDefs` and defaultColDef.filter = false

  // when selectedId changes, programmatically select the matching row in the grid
  useEffect(() => {
    const api = gridRef.current?.api
    if (!api || !selectedId) return
    api.forEachNode((node: any) => {
      const match = node?.data && node.data.name === selectedId
      node.setSelected(!!match)
      if (match) {
        api.ensureIndexVisible(node.rowIndex, 'middle')
      }
    })
  }, [selectedId, rowData])

  const handleRowClick = useCallback(
    (e: any) => {
      onSelect && onSelect(e.data.name)
    },
    [onSelect]
  )

  return (
    <div className="ag-theme-alpine" style={{ width: '100%', height: '40vh' }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="single"
          onRowClicked={handleRowClick}
          animateRows={true}
        />
    </div>
  )
}

export default DataGridComponent
