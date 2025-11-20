# Civisys Risk Manager

Civisys Risk Manager es una plataforma web integral diseñada para la gestión y el control de riesgos en proyectos de ingeniería civil. La aplicación proporciona herramientas visuales y analíticas para monitorear el estado de las obras, registrar incidentes, gestionar documentos y generar reportes detallados.

![Dashboard](https://picsum.photos/seed/dashboard/1200/600)

## ✨ Funcionalidades Principales

### 1. **Dashboard Principal**
Vista centralizada que ofrece una visión general del estado de todos los proyectos a través de:
- **KPIs (Key Performance Indicators)**: Tarjetas con métricas clave como "Obras Activas", "Incidentes Reportados", y "Obras en Riesgo".
- **Gráficos Interactivos**:
  - **Avance de Obras**: Gráfico de barras que muestra el progreso de las obras por zona.
  - **Distribución de Incidentes**: Gráfico de pastel que clasifica los incidentes por tipo (Deslizamiento, Inundación, etc.).
  - **Tendencia de Incidentes**: Gráfico de líneas que muestra la evolución de incidentes reportados a lo largo del tiempo.

### 2. **Gestión de Obras**
Módulo completo para administrar los proyectos de construcción:
- **Listado y Creación (CRUD)**: Tabla para visualizar, crear, editar y eliminar obras.
- **Página de Detalle**: Cada obra tiene una página dedicada que muestra información completa, incluyendo descripción, responsable, fechas, progreso y ubicación en un mapa estático.
- **Estado y Progreso**: Visualización clara del estado de cada obra (Activo, En Riesgo, Finalizado) y su porcentaje de avance.

### 3. **Gestión de Incidentes**
Permite el reporte y seguimiento de eventos adversos en las obras:
- **Reporte de Incidentes**: Formulario para crear nuevos incidentes, especificando tipo, severidad, descripción y ubicación precisa en un mapa.
- **Visualización y Filtrado**: Los incidentes se muestran en tarjetas y se pueden filtrar por su estado (`Reportado`, `En revisión`, `Mitigado`).
- **Cambio de Estado**: Es posible actualizar el estado de un incidente directamente desde la interfaz.

### 4. **Gestión Documental**
Sistema centralizado para la documentación de cada proyecto:
- **Carga de Documentos**: Interfaz para arrastrar y soltar (`drag-and-drop`) o seleccionar archivos para subirlos y asociarlos a una obra específica.
- **Listado por Obra**: Navegación por carpetas virtuales para ver todos los documentos de un proyecto.
- **Gestión de Archivos**: Permite descargar y eliminar documentos existentes.

### 5. **Visualizador SIG (Mapa Interactivo)**
Una de las funcionalidades más potentes de la aplicación, ofreciendo un mapa avanzado para cada obra:
- **Mapa Base Dual**: Control para cambiar la vista del mapa entre **Calles (OpenStreetMap)** y **Satélite (Esri World Imagery)**.
- **Capas de Datos (Overlays)**:
  - **Límites del Proyecto**: Visualización del polígono que define el área de la obra.
  - **Incidentes Georreferenciados**: Marcadores en el mapa para cada incidente, con iconos y colores personalizados según el tipo de riesgo.
  - **Pop-ups Informativos**: Al hacer clic en un incidente, se muestra un pop-up con detalles como tipo, severidad y descripción.
- **Herramientas de Análisis SIG**:
  - **Medición**: Herramienta para medir distancias (metros) y áreas (metros cuadrados) directamente sobre el mapa.
  - **Análisis de Proximidad (Buffer)**: Funcionalidad para dibujar un círculo con un radio definido por el usuario y analizar qué elementos se encuentran dentro de esa área de influencia.

### 6. **Reportes y Exportación**
Módulo para el análisis y la exportación de datos:
- **Panel de Filtros**: Permite filtrar los datos de incidentes por obra, tipo de riesgo y rango de fechas.
- **Exportación Server-Side**:
  - **PDF**: Genera y descarga un reporte en formato PDF con los datos filtrados.
  - **CSV**: Genera y descarga un archivo CSV listo para ser utilizado en hojas de cálculo.

### 7. **Configuración y Autenticación**
- **Página de Configuración**: Interfaz para que el usuario gestione su perfil y preferencias de notificación.
- **Tema Claro y Oscuro**: Botón para cambiar entre los modos de apariencia de la aplicación.
- **Página de Login**: Interfaz de inicio de sesión para el acceso a la plataforma.

## 🚀 Tecnologías Utilizadas

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (con App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **UI Kit**: [Shadcn/ui](https://ui.shadcn.com/) - Componentes reutilizables construidos sobre Radix UI.
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Formularios**: [React Hook Form](https://react-hook-form.com/) con [Zod](https://zod.dev/) para validación.
- **Mapas**: [Leaflet](https://leafletjs.com/) y [React-Leaflet](https://react-leaflet.js.org/) para la interactividad.
  - **Plugins de Leaflet**: `leaflet-measure` para herramientas de medición.
- **Gráficos**: [Recharts](https://recharts.org/)
- **Iconos**: [Lucide React](https://lucide.dev/)

### Backend & API
- **Entorno de Ejecución**: Node.js (a través de Next.js API Routes).
- **Generación de PDF**: [Puppeteer](https://pptr.dev/) para generar PDFs en el servidor a partir de HTML.

### Estructura del Proyecto
```
src/
├── app/                  # Rutas principales de la aplicación (App Router)
│   ├── api/              # Endpoints de la API (ej. para exportación)
│   ├── (rutas)/          # Páginas como /dashboard, /obras, /incidentes, etc.
│   ├── globals.css       # Estilos globales y variables de tema de Tailwind/Shadcn.
│   └── layout.tsx        # Layout principal de la aplicación.
├── components/           # Componentes de React reutilizables
│   ├── ui/               # Componentes base de Shadcn/ui (Button, Card, etc.).
│   └── *.tsx             # Componentes específicos de la aplicación (AppShell, UserNav, etc.).
├── lib/                  # Librerías auxiliares, tipos y datos
│   ├── data.ts           # Datos iniciales y mockups.
│   ├── types.ts          # Definiciones de tipos de TypeScript (Project, Incident).
│   └── utils.ts          # Funciones de utilidad (ej. cn para clases de Tailwind).
├── hooks/                # Hooks de React personalizados (ej. use-toast).
└── public/               # Archivos estáticos.
```

## 🏁 Cómo Empezar

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/civisys-risk-manager.git
    cd civisys-risk-manager
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

4.  Abre [http://localhost:9002](http://localhost:9002) en tu navegador para ver la aplicación en funcionamiento.
