const ones = [
  "", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE",
  "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN",
  "SEVENTEEN", "EIGHTEEN", "NINETEEN",
];
const tens = [
  "", "", "TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY",
];

function twoDigits(n: number): string {
  if (n < 20) return ones[n];
  return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
}

function threeDigits(n: number): string {
  if (n >= 100) {
    return ones[Math.floor(n / 100)] + " HUNDRED" + (n % 100 ? " AND " + twoDigits(n % 100) : "");
  }
  return twoDigits(n);
}

export function indianNumberToWords(amount: number): string {
  const n = Math.round(amount);
  if (n === 0) return "RUPEES ZERO ONLY";

  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const rest = n % 1000;

  let result = "";
  if (crore) result += threeDigits(crore) + " CRORE ";
  if (lakh) result += twoDigits(lakh) + " LAKH ";
  if (thousand) result += threeDigits(thousand) + " THOUSAND ";
  if (rest) result += threeDigits(rest);

  return "RUPEES " + result.trim() + " ONLY";
}
