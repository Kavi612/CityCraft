/** Format INR with Cr / Lakh shorthand for large launch investment figures. */
export function formatRupeeShort(amount: number): string {
  const value = Math.max(0, Math.round(amount))

  if (value >= 10_000_000) {
    const crores = value / 10_000_000
    const text = crores >= 10 ? crores.toFixed(0) : crores.toFixed(1)
    return `₹${text} Cr`
  }

  if (value >= 100_000) {
    const lakhs = value / 100_000
    const text = lakhs >= 100 ? lakhs.toFixed(0) : lakhs.toFixed(2).replace(/\.?0+$/, '')
    return `₹${text} L`
  }

  return `₹${value.toLocaleString('en-IN')}`
}
