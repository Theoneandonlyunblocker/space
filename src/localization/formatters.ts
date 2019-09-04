// TODO 2019.09.04 | rename universalFormatters or something. also attach these to messageformat static
export const formatters =
{
  signedNumber: (n: number) => `${n > 0 ? "+" : ""}${n}`,
  prop: (obj: any, locale: string, key: string) => obj[key],
};
