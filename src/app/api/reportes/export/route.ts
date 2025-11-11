import { NextResponse } from 'next/server'
import { toCsv } from '@/lib/report-utils'
import { incidents } from '@/lib/data'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const params = url.searchParams

    const format = params.get('format') || 'csv'
    const project = params.get('project') || 'all'
    const type = params.get('type') || 'all'
    const from = params.get('from')
    const to = params.get('to')

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
