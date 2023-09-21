function formatCurrency(amount, locale = 'en-US', currencyCode = 'USD') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  }
  
export { formatCurrency };