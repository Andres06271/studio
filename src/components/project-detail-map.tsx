'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet-measure';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Project, Incident } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// --- Iconos Personalizados ---

// Icono para proyectos (marcador por defecto)
const defaultMarkerIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Iconos para Incidentes
const createIncidentIcon = (color: string) => new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28"><path fill="${color}" stroke="#fff" stroke-width="1" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`)}`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
});

const incidentIcons = {
  'Deslizamiento': createIncidentIcon('hsl(var(--chart-3))'), // rojo
  'Inundación': createIncidentIcon('hsl(var(--chart-2))'), // azul
  'Falla Estructural': createIncidentIcon('hsl(var(--chart-5))'), // amarillo
  'Otro': createIncidentIcon('hsl(var(--muted-foreground))'), // gris
};

const getIncidentIcon = (type: string) => {
    return incidentIcons[type as keyof typeof incidentIcons] || incidentIcons['Otro'];
}


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

      const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      });
      
      const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community'
      });

      streetMap.addTo(map);

      const baseMaps = {
        "Vista de Calles": streetMap,
        "Vista Satelital": satelliteMap
      };

      const overlayLayers: { [key: string]: L.Layer } = {};
      
      // --- Capa de la Obra ---
      let projectPolygon: L.Polygon | null = null;
      if (project.boundary && project.boundary.length > 0) {
        projectPolygon = L.polygon(project.boundary.map(p => [p.lat, p.lng]), { 
          color: 'hsl(var(--primary))',
          fillColor: 'hsl(var(--primary))',
          fillOpacity: 0.2
        });
        map.fitBounds(projectPolygon.getBounds());
      } else {
        L.marker([project.latitude, project.longitude], { icon: defaultMarkerIcon }).addTo(map);
      }
      const projectLayer = projectPolygon || L.marker([project.latitude, project.longitude], { icon: defaultMarkerIcon });
      overlayLayers['Área del Proyecto'] = projectLayer.addTo(map);


      // --- Capa de Incidentes ---
      const incidentMarkers: L.Marker[] = [];
      incidents.forEach(incident => {
          let incidentLatLng: L.LatLng;
          if (incident.latitude && incident.longitude) {
              incidentLatLng = new L.LatLng(incident.latitude, incident.longitude);
          } else if (projectPolygon) {
              incidentLatLng = getRandomPointInPolygon(projectPolygon);
          } else {
              const offset = 0.005;
              incidentLatLng = new L.LatLng(
                  project.latitude! + (Math.random() - 0.5) * offset,
                  project.longitude! + (Math.random() - 0.5) * offset
              );
          }
          
          const popupContent = `
            <div style="font-family: sans-serif; font-size: 13px;">
                <strong style="font-size: 14px; color: #333;">${incident.type}</strong>
                <hr style="margin: 4px 0; border: 0; border-top: 1px solid #eee;" />
                <p style="margin: 2px 0;"><strong>Severidad:</strong> ${incident.severity}</p>
                <p style="margin: 2px 0;"><strong>Fecha:</strong> ${format(new Date(incident.date), 'dd MMM, yyyy', { locale: es })}</p>
                <p style="margin-top: 6px; color: #555;">${incident.description}</p>
            </div>
          `;

          const marker = L.marker(incidentLatLng, { icon: getIncidentIcon(incident.type) })
            .bindPopup(popupContent);
          
          incidentMarkers.push(marker);
      });

      if (incidentMarkers.length > 0) {
        const incidentsLayerGroup = L.layerGroup(incidentMarkers);
        overlayLayers['Incidentes Reportados'] = incidentsLayerGroup.addTo(map);
      }
      

      if (interactive) {
        L.control.layers(baseMaps, overlayLayers).addTo(map);
        
        // @ts-ignore - leaflet-measure types are not available
        const measureControl = new L.Control.Measure({
            position: 'topright',
            primaryLengthUnit: 'meters',
            secondaryLengthUnit: 'kilometers',
            primaryAreaUnit: 'sqmeters',
            secondaryAreaUnit: 'hectares',
            activeColor: 'hsl(var(--primary))',
            completedColor: 'hsl(var(--destructive))',
            localization: 'es',
        });
        measureControl.addTo(map);
      }
      
      mapRef.current = map;

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
