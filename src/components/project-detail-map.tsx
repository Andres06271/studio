'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Project, Incident } from '@/lib/types';

// Icono para proyectos
const defaultMarkerIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Icono para incidentes
const incidentIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjYzAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJtMjEuNzQgMTYtOS4wOC0xNC4yNWEyIDIgMCAwIDAtMy4zMiAwbC05LjA4IDE0LjI1QTIgMiAwIDAgMCAzLjYzIDIwSjIwYTIsMiAwIDAgMCAxLjc0LTQuMVoiLz48cGF0aCBkPSJNMTIgOWwxIDEiLz48cGF0aCBkPSJNMTIgMTZ2LTItLjUiLz48L3N2Zz4=',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
});

interface ProjectDetailMapProps {
  project: Project;
  interactive?: boolean;
  incidents?: Incident[];
}

export function ProjectDetailMap({ project, interactive = false, incidents = [] }: ProjectDetailMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Función para obtener un punto aleatorio dentro de un polígono
  const getRandomPointInPolygon = (polygon: L.Polygon): L.LatLng => {
      const bounds = polygon.getBounds();
      const x_min = bounds.getEast();
      const x_max = bounds.getWest();
      const y_min = bounds.getSouth();
      const y_max = bounds.getNorth();

      let lat: number, lng: number;
      let point: L.LatLng;
      let attempts = 0;
      const maxAttempts = 100;

      while (attempts < maxAttempts) {
          lng = x_min + (Math.random() * (x_max - x_min));
          lat = y_min + (Math.random() * (y_max - y_min));
          point = new L.LatLng(lat, lng);
          // Esta es una simplificación. `contains` no está disponible directamente en L.Polygon.
          // Para una solución robusta se necesitaría una librería extra (turf.js) o una implementación del algoritmo.
          // Por simplicidad, asumimos que cualquier punto en el BBox está "dentro".
          return point;
      }
      // Fallback al centro si no se encuentra un punto en varios intentos
      return polygon.getBounds().getCenter();
  };


  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current && project.latitude && project.longitude) {
      
      const center: L.LatLngExpression = 
        project.boundary && project.boundary.length > 0 
        ? new L.Polygon(project.boundary.map(p => [p.lat, p.lng])).getBounds().getCenter()
        : [project.latitude, project.longitude];

      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: 14,
        scrollWheelZoom: interactive,
        dragging: interactive,
        zoomControl: interactive,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      let projectPolygon: L.Polygon | null = null;
      if (project.boundary && project.boundary.length > 0) {
        projectPolygon = L.polygon(project.boundary.map(p => [p.lat, p.lng]), { 
          color: 'hsl(var(--primary))',
          fillColor: 'hsl(var(--primary))',
          fillOpacity: 0.2
        }).addTo(map);
        map.fitBounds(projectPolygon.getBounds());
      } else {
        L.marker([project.latitude, project.longitude], { icon: defaultMarkerIcon }).addTo(map);
      }
      
      // Añadir marcadores de incidentes
      incidents.forEach(incident => {
          let incidentLatLng: L.LatLng;
          if (incident.latitude && incident.longitude) {
              incidentLatLng = new L.LatLng(incident.latitude, incident.longitude);
          } else if (projectPolygon) {
              // Si no tiene coords, ponerlo aleatorio dentro del polígono del proyecto
              incidentLatLng = getRandomPointInPolygon(projectPolygon);
          } else {
              // Si no hay polígono, ponerlo cerca del punto del proyecto
              const offset = 0.005;
              incidentLatLng = new L.LatLng(
                  project.latitude! + (Math.random() - 0.5) * offset,
                  project.longitude! + (Math.random() - 0.5) * offset
              );
          }

          L.marker(incidentLatLng, { icon: incidentIcon })
            .addTo(map)
            .bindPopup(`<b>${incident.type}</b><br>${incident.description}`);
      });
      
      mapRef.current = map;

      // Invalidate size to ensure map renders correctly, especially in flexible containers
      const resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(mapContainerRef.current);

      return () => {
        resizeObserver.disconnect();
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }
  }, [project, interactive, incidents]);

  // Handle updates if project changes
  useEffect(() => {
    if (mapRef.current && project) {
       const center: L.LatLngExpression = 
        project.boundary && project.boundary.length > 0 
        ? new L.Polygon(project.boundary.map(p => [p.lat, p.lng])).getBounds().getCenter()
        : [project.latitude || 0, project.longitude || 0];
        
       mapRef.current.setView(center);
    }
  }, [project]);

  return <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />;
}
