export const assetSources =
{
  battleScoreMidPoint: "./img/icons/battleScoreMidPoint.png",
  nullColor: "./img/icons/nullcolor.png",
  unDetectedUnitIcon: "./img/icons/unDetected.png",

  availableActionPoint: "./img/icons/availableAction.png",
  hoveredActionPoint: "./img/icons/hoveredAction.png",
  spentActionPoint: "./img/icons/spentAction.png",

  tech3Icon: "./img/icons/t2icon.png",
  tech2Icon: "./img/icons/t3icon.png",

  statusEffect_negative_attack:       "./img/icons/statusEffect_negative_attack.png",
  statusEffect_negative_defence:      "./img/icons/statusEffect_negative_defence.png",
  statusEffect_negative_intelligence: "./img/icons/statusEffect_negative_intelligence.png",
  statusEffect_negative_speed:        "./img/icons/statusEffect_negative_speed.png",
  statusEffect_positive_attack:       "./img/icons/statusEffect_positive_attack.png",
  statusEffect_positive_defence:      "./img/icons/statusEffect_positive_defence.png",
  statusEffect_positive_intelligence: "./img/icons/statusEffect_positive_intelligence.png",
  statusEffect_positive_speed:        "./img/icons/statusEffect_positive_speed.png",
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
