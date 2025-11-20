
# Civisy

**Civisys Risk Manager** es una plataforma web integral diseñada para la gestión y el control de riesgos en proyectos de ingeniería civil. La aplicación proporciona herramientas visuales y analíticas para monitorear el estado de las obras, registrar incidentes, gestionar documentos y generar reportes detallados, todo desde una interfaz centralizada y moderna.

---

## 0. Contexto Estratégico de Civisys S.A.S.

Civisys S.A.S. fue establecida por Andrés Felipe Monroy Rojas, Andrés Felipe Pineda Pira y Kevin Leandro Duran Giraldo. La empresa se constituye como una respuesta estratégica a la creciente necesidad de infraestructura segura, eficiente y tecnológicamente trazable en Colombia. Está conformada por un equipo interdisciplinario de ingenieros civiles y especialistas en sistemas de información que trabajan de forma integrada para ofrecer soluciones constructivas inteligentes y sostenibles en los sectores público y privado.

### 0.1. Misión y Visión

*   **Misión:** Civisys S.A.S. existe para **integrar la ingeniería civil y la ingeniería de sistemas** en el desarrollo de soluciones tecnológicas que fortalezcan la gestión de infraestructura, la prevención de deslizamientos y la seguridad vial en Colombia. Su propósito es brindar herramientas digitales confiables y sostenibles que permitan a entidades públicas y privadas planificar, monitorear y mitigar riesgos geotécnicos y estructurales, garantizando eficiencia, transparencia y valor social en cada proyecto ejecutado.
*   **Visión:** Para el año 2035, Civisys S.A.S. aspira a ser reconocida a nivel nacional como una **empresa líder en innovación tecnológica aplicada a la ingeniería civil y la gestión del riesgo**, destacándose por su capacidad para digitalizar procesos constructivos, optimizar la toma de decisiones y promover territorios más seguros y resilientes.

### 0.2. Modelo de Negocio Interdisciplinario

Civisys S.A.S. se diferencia de las constructoras tradicionales al integrar tecnología digital y sistemas de control en la gestión de sus proyectos. La solución propuesta es constituir una empresa de ingeniería interdisciplinaria (civil + sistemas) que ejecute obras de construcción y, al mismo tiempo, implemente plataformas de control digital para cada proyecto. Este modelo garantiza la materialización de proyectos de alta calidad con un sistema de control digital en paralelo, ofreciendo innovación, eficiencia y transparencia.

### 0.3. Políticas Corporativas Relevantes

El desarrollo de la plataforma se guía por las políticas corporativas que enfatizan la calidad, la tecnología y la transparencia:

| Política | Principio Clave |
| :--- | :--- |
| **Calidad** | Asegurar que cada producto, servicio y proyecto cumpla con los más altos estándares técnicos y normativos, garantizando la trazabilidad documental y técnica de todos los proyectos. |
| **Innovación y Tecnología** | Integrar la ingeniería civil con la ingeniería de sistemas para optimizar la gestión de infraestructura y el análisis de riesgos. Fomenta el uso de metodologías de desarrollo eficientes como MVC, DevOps y Agile Scrum. |
| **Ética y Cumplimiento** | Fundamentar las operaciones en la transparencia y la prevención de la corrupción. Los sistemas deben garantizar una gestión empresarial verificable. |

---

## 1. Visión del Producto

### 1.1. Problema a Resolver

La gestión de proyectos de ingeniería civil a gran escala es inherentemente compleja y está expuesta a una multitud de riesgos (geotécnicos, estructurales, climáticos, etc.). La información crítica suele estar dispersa en múltiples documentos, correos electrónicos y sistemas, lo que dificulta:

*   Tener una visión clara y en **tiempo real** del estado de los proyectos.
*   Identificar y correlacionar incidentes de manera eficiente.
*   Evaluar rápidamente el impacto de un riesgo en áreas geográficas específicas.
*   Generar reportes consolidados para la toma de decisiones.

### 1.2. Usuarios Principales y Valor Central

*   **Ingenieros de Campo y Jefes de Obra**: Necesitan una herramienta ágil para reportar incidentes desde el terreno, consultar documentación técnica (planos, estudios) y visualizar la ubicación exacta de los problemas.
*   **Gerentes de Proyecto y Directores**: Requieren una visión macro para monitorear el avance de múltiples obras, identificar proyectos en riesgo, analizar tendencias y generar reportes ejecutivos.
*   **Analistas SIG**: Buscan una plataforma que integre datos tabulares con una representación geoespacial para realizar análisis de proximidad, superposición de capas y mediciones.

El **valor central** de Civisys es **centralizar y visualizar la gestión de riesgos**, transformando datos complejos en información accionable a través de dashboards, mapas interactivos y reportes personalizables.

---

## 2. Criterios de Aceptación (Alto Nivel)

*   **Dashboard**: Debe mostrar KPIs actualizados y gráficos interactivos sobre el estado general de los proyectos.
*   **Gestión de Obras**: Permitir crear, ver, editar y eliminar una obra. La página de detalle debe incluir un mapa de ubicación.
*   **Gestión de Incidentes**: Permitir reportar un nuevo incidente, asociarlo a una obra y georreferenciarlo en el mapa. El estado del incidente debe ser actualizable (ej. `Reportado`, `En revisión`, `Mitigado`).
*   **Visualizador SIG**: El mapa interactivo debe permitir cambiar entre vista de calles y satélite, activar/desactivar capas (límites, incidentes), medir distancias/áreas y realizar análisis de *buffer*.
*   **Reportes**: El usuario debe poder filtrar datos por múltiples criterios y exportarlos a formatos **PDF** y **CSV** directamente desde el servidor.

---

## ✨ 3. Funcionalidades Principales

*   **Dashboard Principal (3.1):** Vista centralizada con KPIs (Obras Activas, Incidentes Reportados) y gráficos interactivos.
*   **Gestión de Obras (3.2):** Módulo para administrar proyectos (CRUD), incluyendo detalles, estado, progreso, responsable y ubicación en un mapa estático.
*   **Gestión de Incidentes (3.3):** Formulario para reportar eventos adversos, especificando tipo, severidad y ubicación precisa. Permite el seguimiento y cambio de estado.
*   **Gestión Documental (3.4):** Sistema para cargar, visualizar y gestionar documentos (planos, informes) asociados a cada obra, con una interfaz de arrastrar y soltar.
*   **Visualizador SIG (3.5):** Mapa potente por obra que incluye **Control de Capas Base** (OpenStreetMap, Esri World Imagery), **Capas de Datos** (límites de proyecto, incidentes) y **Herramientas de Análisis** como Medición de distancias y áreas, y Análisis de Proximidad (*Buffer*).
*   **Reportes y Exportación (3.6):** Módulo para filtrar datos y generar exportaciones en formatos **PDF** (usando *Puppeteer* para alta fidelidad) y **CSV** directamente desde el servidor.

---

## 🚀 4. Arquitectura y Tecnologías

El sistema se construyó usando un ecosistema basado en React y TypeScript para crear una aplicación web moderna, escalable y de alto rendimiento.

### 4.1. Stack Tecnológico

| Capa | Tecnología | Justificación |
| :--- | :--- | :--- |
| **Framework** | **Next.js** (App Router) | Renderizado del lado del servidor (SSR) para SEO y rendimiento inicial. |
| **Lenguaje** | **TypeScript** (97.8% del código) | Aporta seguridad de tipos, lo que reduce errores en tiempo de ejecución y mejora la mantenibilidad. |
| **Estilos** | **Tailwind CSS** | Permite crear interfaces personalizadas rápidamente. |
| **Mapas** | **Leaflet + React-Leaflet** | Librería de mapas de código abierto, ligera y potente, con un ecosistema de *plugins* maduro. |
| **PDF Server** | **Puppeteer** | Para la generación de reportes PDF de alta fidelidad en el servidor. |
| **UI Kit** | Shadcn/ui sobre Radix UI | Proporciona componentes accesibles y fáciles de personalizar con Tailwind. |

### 4.2. Estructura del Proyecto

El código está organizado bajo una estructura clara de módulos, utilizando el App Router de Next.js:

```
src/
├── app/ # Rutas principales y endpoints de la API (api/)
├── components/ # Componentes de React reutilizables
├── lib/ # Librerías auxiliares, tipos (types.ts) y datos
└── public/ # Archivos estáticos.
```

---

## 🛠️ 5. Estándares y Prácticas de Código

*   **Tipado Estricto:** Se exige el uso de **TypeScript de forma estricta**. Todos los tipos para las entidades de datos principales están centralizados en `src/lib/types.ts`.
*   **Nomenclatura:** Se utiliza `PascalCase` para Componentes, Tipos e Interfaces (ej. `ProjectFormDialog`), y `camelCase` para variables y funciones (ej. `handleProjectCreated`).
*   **Manejo de Estado:** El estado local se gestiona con *hooks* de React (`useState`, `useEffect`). Para el estado global simple, se utiliza `localStorage` y `Context`.
*   **Componentes:** Se prioriza la creación de componentes pequeños y reutilizables.

---

##  UML: Diagrama de Entidades

A continuación, se muestra un diagrama simplificado de las principales entidades de datos y sus relaciones.


- diagrama de clases
<img width="2018" height="1196" alt="image" src="https://github.com/user-attachments/assets/d7e38168-8fe4-4a90-9d4e-0b85ccee6dcb" />

- diagrama de casos de uso

<img width="1479" height="2312" alt="image" src="https://github.com/user-attachments/assets/26cd8692-519a-4494-b381-f83fb28e4bed" />

- diagrama de arquitectura

<img width="3078" height="2887" alt="image" src="https://github.com/user-attachments/assets/6c67e3a7-d58d-43ca-b22d-2b597dd53a1a" />

- Diagrama de Secuencia, Reportar incidente

<img width="1946" height="1033" alt="image" src="https://github.com/user-attachments/assets/e0b55795-55f6-44ff-b15b-4194666972b8" />
