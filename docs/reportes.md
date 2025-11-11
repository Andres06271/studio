# Reportes — documentación

Esta documentación describe las funcionalidades de reportes disponibles en la aplicación, cómo usarlas y cómo funcionan los endpoints de exportación (CSV / PDF).

## Exportar CSV (UI)

- Desde la página `/reportes` utiliza el botón `Exportar CSV` para descargar un archivo con los incidentes filtrados por obra, tipo y rango de fechas.
- La exportación llama al endpoint server-side: `/api/reportes/export?format=csv&project=...&type=...&from=YYYY-MM-DD&to=YYYY-MM-DD`.
- También puedes llamar al endpoint directamente desde una herramienta HTTP.

Ejemplo:

```
GET /api/reportes/export?format=csv&project=Viaducto%20del%20Suroeste&type=Deslizamiento&from=2024-01-01&to=2024-12-31
```

## Exportar PDF (cliente)

- La página `Reportes` incluye ahora una exportación a PDF que se genera en el navegador usando `html2canvas` + `jsPDF`.
- Este método captura visualmente la sección del reporte y la convierte a PDF. Es una solución rápida y no requiere dependencias de servidor.

Requisitos (instalar localmente antes de usar):

```powershell
npm install html2canvas jspdf
```

Cómo usar:

1. Abre `/reportes` en el navegador.
2. Ajusta los filtros (obra, tipo, rango de fechas).
3. Haz clic en `Exportar PDF` y descarga el PDF generado.

Limitaciones:

- La calidad del PDF depende de la renderización del navegador. Para PDFs con alta fidelidad o que requieran paginación avanzada, se recomienda generación server-side (Puppeteer, Playwright o @react-pdf/renderer).
- Si necesitas paginación real (dividir automáticamente contenido largo en varias páginas PDF), es mejor una solución server-side o un renderizado especial del contenido.

## Endpoint de exportación (server-side)

- `GET /api/reportes/export` — soporta:
  - `format` = `csv` (por defecto) o `json`.
  - `project`, `type`, `from`, `to` — filtros opcionales.

Respuesta:
- Si `format=csv` se devuelve `text/csv` con header `Content-Disposition` para forzar descarga.
- Si `format=json` devuelve JSON con los incidentes filtrados.

### Generación server-side de PDF

- Ahora el endpoint soporta `format=pdf` y, si Puppeteer está instalado en el servidor, devolverá un PDF generado a partir de una plantilla HTML con los incidentes filtrados.
- Ejemplo de uso:

```
GET /api/reportes/export?format=pdf&project=Viaducto%20del%20Suroeste&type=Deslizamiento&from=2024-01-01&to=2024-12-31
```

Instalación de Puppeteer (servidor):

```powershell
npm install puppeteer
```

Notas:
- En entornos serverless o contenedores ligeros puede ser necesario ajustar las opciones de lanzamiento de Puppeteer (por ejemplo, usar `puppeteer-core` y un ejecutable del sistema, o pasar flags `--no-sandbox`). Consulta la documentación de Puppeteer según tu entorno de despliegue.
- Si Puppeteer no está instalado, el endpoint devolverá 501 con un mensaje indicando que se requiere Puppeteer.

## Seguridad y siguientes pasos

- Actualmente los endpoints y la exportación no tienen control de acceso. Para datos sensibles, añade autenticación y autorización (middleware) antes de exponer los endpoints de export.
- Para grandes volúmenes, implementa streaming CSV en el servidor o límites/paginación.
- Para PDFs de alta calidad o envío programado por correo, implementar generación server-side y un job/scheduler.

Si quieres, implemento el PDF server-side en la próxima iteración (puppeteer / @react-pdf) y añado ejemplos de uso y tests.
