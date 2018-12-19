export const iconSources =
{
  test1: "./img/test1.png",
  test2: "./img/test2.png",
  test3: "./img/test3.png",
};

let baseUrl = "";

export function setBaseUrl(newUrl: string): void
{
  baseUrl = newUrl;
}

export function getIconSrc(type: keyof typeof iconSources): string
{
  return baseUrl + iconSources[type];
}
