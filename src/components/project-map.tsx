'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

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

interface ProjectMapProps {
  lat: number;
  lng: number;
  onMapClick: (lat: number, lng: number) => void;
}

export function ProjectMap({ lat, lng, onMapClick }: ProjectMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Prevent double initialization
    if (mapRef.current) return;
    
    const container = containerRef.current;
    if (!container) return;

    // Create the map
    try {
      const map = L.map(container, {
        center: [lat, lng],
        zoom: 13,
        scrollWheelZoom: true,
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add marker
      const marker = L.marker([lat, lng], { icon: markerIcon }).addTo(map);
      markerRef.current = marker;

      // Add click handler
      map.on('click', (e) => {
        onMapClick(e.latlng.lat, e.latlng.lng);
        
        // Update marker position
        if (markerRef.current) {
          markerRef.current.setLatLng(e.latlng);
        }
      });

      mapRef.current = map;
      
      // Invalidate size after a short delay
      setTimeout(() => {
        map.invalidateSize();
        setIsLoaded(true);
      }, 100);

    } catch (error) {
      console.error('Error initializing map:', error);
    }

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markerRef.current = null;
    };
  }, []); // Empty dependency array - only run once

  // Update marker position when lat/lng changes
  useEffect(() => {
    if (markerRef.current && isLoaded) {
      markerRef.current.setLatLng([lat, lng]);
      if (mapRef.current) {
        mapRef.current.setView([lat, lng]);
      }
    }
  }, [lat, lng, isLoaded]);

  return (
    <div 
      ref={containerRef} 
      style={{ height: '100%', width: '100%' }}
    />
  );
}
