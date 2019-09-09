import {baseUrl} from "../baseUrl";


const unitIconSources =
{
  b:  "./img/icons/b.png",
  bc: "./img/icons/bc.png",
  f:  "./img/icons/f.png",
  fa: "./img/icons/fa.png",
  fb: "./img/icons/fb.png",
  sc: "./img/icons/sc.png",
  sh: "./img/icons/sh.png",
};

export function getUnitIconSrc(type: keyof typeof unitIconSources): string
{
  return new URL(unitIconSources[type], baseUrl).toString();
}
