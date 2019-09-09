import {baseUrl} from "../baseUrl";


const itemIconSources =
{
  armor: "./img/armor.png",
  blueThing: "./img/blueThing.png",
  cannon: "./img/cannon.png",
};

export function getItemIconSrc(type: keyof typeof itemIconSources): string
{
  return new URL(itemIconSources[type], baseUrl).toString();
}
