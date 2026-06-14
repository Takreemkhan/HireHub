export function getCurrencySymbol(currencyCode?: string): string {
  if (!currencyCode) return "$";
  const c = currencyCode.toUpperCase();
  switch (c) {
    case "USD":
      return "$";
    case "GBP":
      return "£";
    case "EUR":
      return "€";
    case "INR":
      return "₹";
    default:
      return currencyCode;
  }
}
