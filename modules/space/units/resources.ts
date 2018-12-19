export const iconSources =
{
  b:  "./img/icons/b.png",
  bc: "./img/icons/bc.png",
  f:  "./img/icons/f.png",
  fa: "./img/icons/fa.png",
  fb: "./img/icons/fb.png",
  sc: "./img/icons/sc.png",
  sh: "./img/icons/sh.png",
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
