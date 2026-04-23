import React, { useEffect, useMemo, useState } from 'react'
import './App.css'
import MapComponent from './components/Map/MapComponent'
import DataGridComponent from './components/DataGrid/DataGridComponent'

type GeoJSONFeatureCollection = GeoJSON.FeatureCollection | null

function App() {
  const [pipes, setPipes] = useState<any[] | null>(null)
  const [selectedName, setSelectedName] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string>('All')

  useEffect(() => {
    fetch('/data/mock_pipes_data.json')
      .then((r) => r.json())
      .then((data) => setPipes(data))
      .catch((err) => {
        console.error('Failed to load pipes data', err)
      })
  }, [])

  const allTags = useMemo(() => {
    if (!pipes) return []
    const s = new Set<string>()
    pipes.forEach((p) => (p.tags || []).forEach((t: string) => s.add(t)))
    return Array.from(s).sort()
  }, [pipes])

  const filteredPipes = useMemo(() => {
    if (!pipes) return []
    if (!selectedTag || selectedTag === 'All') return pipes
    return pipes.filter((p) => (p.tags || []).includes(selectedTag))
  }, [pipes, selectedTag])

  return (
    <div className="app-root">
      <MapComponent pipes={filteredPipes || []} selectedName={selectedName} onSelect={(name) => setSelectedName(name)} />

      <div style={{ padding: '8px 12px', display: 'flex', gap: 12, alignItems: 'center' }}>
        <label style={{ fontWeight: 600 }}>Filter by tag:</label>
        <select className="tag-filter" value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
          <option value="All">All</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <DataGridComponent rows={filteredPipes || []} onSelect={(name) => setSelectedName(name)} selectedId={selectedName} availableTags={allTags} />
    </div>
  )
}

export default App
