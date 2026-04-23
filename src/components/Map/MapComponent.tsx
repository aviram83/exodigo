import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './Map.css'

type GeoPoint = { lat: number; lon: number }
type Pipe = {
  name: string
  startPoint: GeoPoint
  endPoint: GeoPoint
  color: { label: string; hex: string; opacity?: number }
  tags: string[]
}

type MapProps = {
  pipes: Pipe[]
  selectedName?: string | null
  onSelect?: (name: string) => void
}

function FitToSelection({ pipes, selectedName }: { pipes: Pipe[]; selectedName?: string | null }) {
  const map = useMap()

  useEffect(() => {
    if (!pipes || !selectedName) return
    const found = pipes.find((p) => p.name === selectedName)
    if (!found) return
    const lat1 = found.startPoint.lat
    const lon1 = found.startPoint.lon
    const lat2 = found.endPoint.lat
    const lon2 = found.endPoint.lon
    try {
      map.fitBounds([
        [lat1, lon1],
        [lat2, lon2]
      ], { padding: [20, 20] })
    } catch (e) {
      // ignore
    }
  }, [pipes, selectedName, map])

  return null
}

const MapComponent: React.FC<MapProps> = ({ pipes, selectedName, onSelect }) => {
  const defaultCenter: [number, number] = pipes && pipes.length > 0
    ? [pipes[0].startPoint.lat, pipes[0].startPoint.lon]
    : [44.97, -93.27]

  return (
    <div className="map-wrapper">
      <MapContainer center={defaultCenter} zoom={13} className="map-container">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pipes.map((p) => {
          const positions: [number, number][] = [
            [p.startPoint.lat, p.startPoint.lon],
            [p.endPoint.lat, p.endPoint.lon]
          ]
          const isSelected = selectedName === p.name
          return (
            <Polyline
              key={p.name}
              positions={positions}
              pathOptions={{ color: isSelected ? '#ff0000' : p.color.hex, weight: isSelected ? 6 : 4, opacity: p.color.opacity ?? 0.9 }}
              eventHandlers={{
                click: () => onSelect && onSelect(p.name)
              }}
            />
          )
        })}
        <FitToSelection pipes={pipes} selectedName={selectedName} />
      </MapContainer>
    </div>
  )
}

export default MapComponent
