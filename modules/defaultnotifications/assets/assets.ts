// TODO 2019.09.09 | these don't exist
export const iconSources =
{
  test1: "./assets/img/test1.png",
  test2: "./assets/img/test2.png",
  test3: "./assets/img/test3.png",
};

let baseUrl = "";

export function setBaseUrl(newUrl: string): void
{
  baseUrl = newUrl;
}

export function getIconSrc(type: keyof typeof iconSources): string
{
  return new URL(iconSources[type], baseUrl).toString();
}
