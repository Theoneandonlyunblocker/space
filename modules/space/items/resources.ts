export const iconSources =
{
  armor: "./img/armor.png",
  blueThing: "./img/blueThing.png",
  cannon: "./img/cannon.png",
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
