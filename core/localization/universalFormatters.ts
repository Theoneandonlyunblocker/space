export const universalFormatters =
{
  signedNumber: (n: number) => `${n > 0 ? "+" : ""}${n}`,
  prop: (obj: any, locale: string, key: string) => obj[key],
};
