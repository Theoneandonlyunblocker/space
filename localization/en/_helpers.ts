export function wasWere(argName: string): string
{
  return(
    `{${argName}, plural,` +
      `one   {was}` +
      `other {were}` +
    `}`
  );
}
