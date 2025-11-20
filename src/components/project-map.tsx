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

// Component to handle map reference and resizing
const MapController = () => {
  const map = useMap();
  
  useEffect(() => {
    // Invalidar el tamaño del mapa cuando se monta
    const timeoutId = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [map]);
  
  return null;
};

interface ProjectMapProps {
  lat: number;
  lng: number;
  onMapClick: (lat: number, lng: number) => void;
}

export function ProjectMap({ lat, lng, onMapClick }: ProjectMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Cleanup function to remove any existing map instance
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      
      // Also cleanup any orphaned leaflet containers in the DOM
      const container = containerRef.current;
      if (container) {
        const leafletContainers = container.querySelectorAll('.leaflet-container');
        leafletContainers.forEach((element) => {
          const htmlElement = element as HTMLElement;
          if ((htmlElement as any)._leaflet_id) {
            delete (htmlElement as any)._leaflet_id;
          }
        });
      }
    };
  }, []);

  return (
    <div ref={containerRef} style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={[lat, lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        ref={(map) => {
          if (map) {
            mapInstanceRef.current = map;
          }
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={markerIcon} />
        <MapEvents onMapClick={onMapClick} />
        <MapController />
      </MapContainer>
    </div>
  );
}
