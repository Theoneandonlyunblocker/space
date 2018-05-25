export const transformers =
{
  capitalize: (s: string) => s.charAt(0).toUpperCase() + s.slice(1),
  signedNumber: (n: number) => `${n > 0 ? "+" : ""}${n}`,
};
