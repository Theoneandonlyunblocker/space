import {baseUrl} from "../baseUrl";


const itemIconSources =
{
  armor: "./assets/items/img/armor.png",
  blueThing: "./assets/items/img/blueThing.png",
  cannon: "./assets/items/img/cannon.png",
};

export function getItemIcon(type: keyof typeof itemIconSources): HTMLImageElement
{
  const img = new Image();
  img.src = new URL(itemIconSources[type], baseUrl).toString();

  return img;
}
