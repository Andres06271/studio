// Utilities to generate and download CSV files for reports
// Lightweight implementation to avoid new dependencies.

export function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return ''
  const s = String(value)
  if (s.includes('"') || s.includes(',') || s.includes('\n') || s.includes('\r')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export function toCsv(items: Record<string, unknown>[], columns: { key: string; label?: string }[]) {
  const header = columns.map((c) => escapeCsv(c.label ?? c.key)).join(',')
  const rows = items.map((item) =>
    columns.map((c) => escapeCsv(item[c.key])).join(',')
  )
  return [header, ...rows].join('\r\n')
}

export function downloadFile(filename: string, content: string, mime = 'text/csv') {
  // Browser download helper
  const blob = new Blob([content], { type: `${mime};charset=utf-8;` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  // release object URL shortly after
  setTimeout(() => URL.revokeObjectURL(url), 5000)
}
