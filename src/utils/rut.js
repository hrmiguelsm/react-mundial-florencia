export function formatRut(rut) {
  const cleaned = rut.replace(/[^0-9kK]/g, '')
  if (cleaned.length < 2) return cleaned
  const body = cleaned.slice(0, -1)
  const dv = cleaned.slice(-1).toUpperCase()
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${formatted}-${dv}`
}

export function cleanRut(rut) {
  return rut.replace(/[^0-9kK]/g, '').toUpperCase()
}

export function validateRut(rut) {
  const cleaned = cleanRut(rut)
  if (cleaned.length < 2) return false
  const body = cleaned.slice(0, -1)
  const dv = cleaned.slice(-1)
  if (!/^\d+$/.test(body)) return false

  let sum = 0
  let multiplier = 2
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }
  const remainder = 11 - (sum % 11)
  let expectedDv
  if (remainder === 11) expectedDv = '0'
  else if (remainder === 10) expectedDv = 'K'
  else expectedDv = String(remainder)

  return dv === expectedDv
}
