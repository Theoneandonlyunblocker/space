export const assetSources =
{
  battleScoreMidPoint: "./assets/img/icons/battleScoreMidPoint.png",
  nullColor: "./assets/img/icons/nullcolor.png",
  unDetectedUnitIcon: "./assets/img/icons/unDetected.png",

  availableActionPoint: "./assets/img/icons/availableAction.png",
  hoveredActionPoint: "./assets/img/icons/hoveredAction.png",
  spentActionPoint: "./assets/img/icons/spentAction.png",

  tech3Icon: "./assets/img/icons/t2icon.png",
  tech2Icon: "./assets/img/icons/t3icon.png",

  statusEffect_negative_attack:       "./assets/img/icons/statusEffect_negative_attack.png",
  statusEffect_negative_defence:      "./assets/img/icons/statusEffect_negative_defence.png",
  statusEffect_negative_intelligence: "./assets/img/icons/statusEffect_negative_intelligence.png",
  statusEffect_negative_speed:        "./assets/img/icons/statusEffect_negative_speed.png",
  statusEffect_positive_attack:       "./assets/img/icons/statusEffect_positive_attack.png",
  statusEffect_positive_defence:      "./assets/img/icons/statusEffect_positive_defence.png",
  statusEffect_positive_intelligence: "./assets/img/icons/statusEffect_positive_intelligence.png",
  statusEffect_positive_speed:        "./assets/img/icons/statusEffect_positive_speed.png",

  battleSceneFlagFade: "./assets/img/battleSceneFlagFade.svg",

  css: "./assets/css/main.css",
};

export const cachedAssets:
{
  battleSceneFlagFade: SVGElement;
} =
{
  battleSceneFlagFade: undefined,
};


let baseUrl = "";

export function setBaseUrl(newUrl: string): void
{
  baseUrl = newUrl;
}

export function getAssetSrc(key: keyof typeof assetSources): string
{
  return new URL(assetSources[key], baseUrl).toString();
}
