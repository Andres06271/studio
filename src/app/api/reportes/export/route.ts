import { NextResponse } from 'next/server'
import { toCsv } from '@/lib/report-utils'
import { incidents } from '@/lib/data'
import { authorize } from '@/lib/auth'
import { appendAudit } from '@/lib/audit'

export async function GET(req: Request) {
  try {
  const url = new URL(req.url)
    const params = url.searchParams

    const format = params.get('format') || 'csv'
    const project = params.get('project') || 'all'
    const type = params.get('type') || 'all'
    const from = params.get('from')
    const to = params.get('to')

  // authorization
  const auth = await authorize(req)

  // filter incidents
    const filtered = incidents.filter((i) => {
      if (project !== 'all' && i.project !== project) return false
      if (type !== 'all' && i.type !== type) return false
      if (from) {
        const fromTs = new Date(from).getTime()
        const toTs = to ? new Date(to).getTime() : fromTs
        const id = new Date(i.date).getTime()
        if (id < fromTs || id > toTs) return false
      }
      return true
    })

  if (format === 'pdf') {
      // Generate PDF server-side using puppeteer. This requires puppeteer to be installed
      try {
        const puppeteer = await import('puppeteer')

        const html = `<!doctype html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>Reportes - Incidentes</title>
            <style>
              body { font-family: Arial, Helvetica, sans-serif; padding: 20px; }
              h1 { font-size: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 12px }
              th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px }
              th { background: #f4f4f4; text-align: left }
            </style>
          </head>
          <body>
            <h1>Reporte de Incidentes</h1>
            <p>Filtros: project=${project}, type=${type}, from=${from || '-'}, to=${to || '-'}</p>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Severidad</th>
                  <th>Fecha</th>
                  <th>Proyecto</th>
                  <th>Estado</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                ${filtered
                  .map((i) => `
                    <tr>
                      <td>${i.id}</td>
                      <td>${i.type}</td>
                      <td>${i.severity}</td>
                      <td>${i.date}</td>
                      <td>${i.project}</td>
                      <td>${i.status}</td>
                      <td>${String(i.description || '').replace(/</g, '&lt;')}</td>
                    </tr>
                  `)
                  .join('')}
              </tbody>
            </table>
          </body>
        </html>`

        const browser = await puppeteer.launch()
        const pageP = await browser.newPage()
        await pageP.setContent(html, { waitUntil: 'networkidle0' })
        const pdfBuffer = await pageP.pdf({ format: 'A4', printBackground: true })
        await browser.close()

        // audit log
        appendAudit({ user: auth, action: 'export', format: 'pdf', filters: { project, type, from, to }, count: filtered.length })

        return new Response(pdfBuffer as unknown as BodyInit, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="reportes-incidentes.pdf"`,
          },
        })
      } catch (err) {
        // If puppeteer isn't installed or launch fails, return a helpful message
        // eslint-disable-next-line no-console
        console.error('PDF generation failed', err)
        return new Response('PDF generation requires puppeteer to be installed on the server.', { status: 501 })
      }
    }

    if (format === 'csv') {
      const columns = [
        { key: 'id', label: 'ID' },
        { key: 'type', label: 'Tipo' },
        { key: 'severity', label: 'Severidad' },
        { key: 'date', label: 'Fecha' },
        { key: 'description', label: 'Descripción' },
        { key: 'status', label: 'Estado' },
        { key: 'project', label: 'Proyecto' },
      ]

      const csv = toCsv(filtered as any[], columns)

      // audit log
      appendAudit({ user: auth, action: 'export', format: 'csv', filters: { project, type, from, to }, count: filtered.length })

      return new Response(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="reportes-incidentes.csv"`,
        },
      })
    }

  // default: return json
    return NextResponse.json(filtered)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error en export route', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}
