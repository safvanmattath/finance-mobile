export type CurrencyType = "INR" | "AED";

const CURRENCY_CONFIG: Record<CurrencyType, { locale: string; symbol: string }> = {
  INR: { locale: "en-IN", symbol: "₹" },
  AED: { locale: "en-AE", symbol: "د.إ" },
};

export function formatMoney(amount: number, currency: CurrencyType): string {
  const config = CURRENCY_CONFIG[currency];
  return amount.toLocaleString(config.locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  });
}

export function getCurrencySymbol(currency: CurrencyType): string {
  return CURRENCY_CONFIG[currency].symbol;
}

export function getAllCurrencies(): CurrencyType[] {
  return ["INR", "AED"];
}
