export function exportCsv(filename: string, rows: any[]) {
  const csv = [
    Object.keys(rows[0] || {}).join(','),
    ...rows.map(r => Object.values(r).map(v =>
      typeof v === 'string' && v.includes(',') ? `"${v.replace(/"/g,'""')}"` : v
    ).join(',')),
  ].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}
