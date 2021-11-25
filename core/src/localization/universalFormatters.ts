export const universalFormatters =
{
  getSign: (n: number) => `${n > 0 ? "+" : ""}`,
  signedNumber: (n: number) => `${universalFormatters.getSign(n)}${n}`,
  prop: (obj: any, locale: string, key: string) => obj[key],
  upToFixed: (_n: number | string, locale: string, decimals: string) =>
  {
    const n = Number(_n);
    const toMaxPrecision = n.toFixed(Number(decimals));
    const withoutTrailingZeros = toMaxPrecision.replace(/\.?0+?$/, "");

    return withoutTrailingZeros;
  },
  percentage: (n: number) => `${n * 100}`,
  percentageUpToFixed: (n: number, locale: string, decimals: string) =>
    universalFormatters.upToFixed(universalFormatters.percentage(n), locale, decimals),
};
