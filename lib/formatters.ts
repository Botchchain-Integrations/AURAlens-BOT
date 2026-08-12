export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 10 ? 2 : 0,
  }).format(value);
}

export function formatTokenBalance(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: value < 1 ? 6 : 4,
  }).format(value);
}

export function shortAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
