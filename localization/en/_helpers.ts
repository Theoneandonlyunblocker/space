export function wasWere(argName: string): string
{
  return(
    `{${argName}, plural,` +
      `one   {was}` +
      `other {were}` +
    `}`
  );
}

export function noOther(argName: string): string
{
  return `other {\\{INVALID_VALUE {${argName}}\\}}`;
}
