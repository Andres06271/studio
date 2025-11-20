'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useRef } from 'react';

// Solución para el ícono de marcador que no aparece por defecto con Webpack
const markerIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapEventsProps {
  onMapClick: (lat: number, lng: number) => void;
}

const MapEvents = ({ onMapClick }: MapEventsProps) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

interface ProjectMapProps {
  lat: number;
  lng: number;
  onMapClick: (lat: number, lng: number) => void;
}

export function ProjectMap({ lat, lng, onMapClick }: ProjectMapProps) {
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    // Cuando el modal se abre, el mapa a veces no sabe su tamaño.
    // Invalidamos el tamaño del mapa para que se ajuste al contenedor.
    const map = mapRef.current;
    if (map) {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }, []);

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      whenCreated={(map) => {
        (mapRef as React.MutableRefObject<L.Map | null>).current = map;
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={markerIcon} />
      <MapEvents onMapClick={onMapClick} />
    </MapContainer>
  );
}
