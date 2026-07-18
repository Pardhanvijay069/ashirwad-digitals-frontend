const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Format a number as Indian Rupees (₹).
 */
export function formatCurrency(amount: number): string {
  return INR_FORMATTER.format(amount);
}
