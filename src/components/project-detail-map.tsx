'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Project } from '@/lib/types';

const markerIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface ProjectDetailMapProps {
  project: Project;
}

export function ProjectDetailMap({ project }: ProjectDetailMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current && project.latitude && project.longitude) {
      
      const center: L.LatLngExpression = 
        project.boundary && project.boundary.length > 0 
        ? new L.Polygon(project.boundary.map(p => [p.lat, p.lng])).getBounds().getCenter()
        : [project.latitude, project.longitude];

      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: 14,
        scrollWheelZoom: false,
        dragging: true, // Allow dragging
        zoomControl: true, // Show zoom control
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      if (project.boundary && project.boundary.length > 0) {
        const polygon = L.polygon(project.boundary.map(p => [p.lat, p.lng]), { 
          color: 'hsl(var(--primary))',
          fillColor: 'hsl(var(--primary))',
          fillOpacity: 0.2
        }).addTo(map);
        map.fitBounds(polygon.getBounds());
      } else {
        L.marker([project.latitude, project.longitude], { icon: markerIcon }).addTo(map);
      }
      
      mapRef.current = map;

      setTimeout(() => {
          map.invalidateSize();
      }, 100);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [project]);

  return <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />;
}
