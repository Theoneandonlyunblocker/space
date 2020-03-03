export const assetSources =
{
  placeHolder: "./assets/img/placeHolder.png"
};

export const assetsToLoadIntoTextureCache: (keyof typeof assetSources)[] =
[
  "placeHolder",
];

let baseUrl = "";

export function setBaseUrl(newUrl: string): void
{
  baseUrl = newUrl;
}

export function getAssetSrc(key: keyof typeof assetSources): string
{
  return new URL(assetSources[key], baseUrl).toString();
}
