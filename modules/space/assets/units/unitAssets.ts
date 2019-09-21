import {baseUrl} from "../baseUrl";


const unitIconSources =
{
  b:  "./assets/units/img/icons/b.png",
  bc: "./assets/units/img/icons/bc.png",
  f:  "./assets/units/img/icons/f.png",
  fa: "./assets/units/img/icons/fa.png",
  fb: "./assets/units/img/icons/fb.png",
  sc: "./assets/units/img/icons/sc.png",
  sh: "./assets/units/img/icons/sh.png",
};

export function getUnitIconSrc(type: keyof typeof unitIconSources): string
{
  return new URL(unitIconSources[type], baseUrl).toString();
}
