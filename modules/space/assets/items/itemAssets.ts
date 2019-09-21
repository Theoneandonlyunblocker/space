import {baseUrl} from "../baseUrl";


const itemIconSources =
{
  armor: "./assets/items/img/armor.png",
  blueThing: "./assets/items/img/blueThing.png",
  cannon: "./assets/items/img/cannon.png",
};

export function getItemIconSrc(type: keyof typeof itemIconSources): string
{
  return new URL(itemIconSources[type], baseUrl).toString();
}
