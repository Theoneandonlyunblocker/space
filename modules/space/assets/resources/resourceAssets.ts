import {baseUrl} from "../baseUrl";


const resourceIconSources =
{
  test1: "./assets/resources/img/test1.png",
  test2: "./assets/resources/img/test2.png",
  test3: "./assets/resources/img/test3.png",
  test4: "./assets/resources/img/test4.png",
  test5: "./assets/resources/img/test5.png",
};

export function getResourceIcon(type: keyof typeof resourceIconSources): HTMLImageElement
{
  const img = new Image();
  img.src = new URL(resourceIconSources[type], baseUrl).toString();

  return img;
}
