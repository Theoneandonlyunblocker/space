import {baseUrl} from "../baseUrl";


const resourceIconSources =
{
  test1: "./img/test1.png",
  test2: "./img/test2.png",
  test3: "./img/test3.png",
  test4: "./img/test4.png",
  test5: "./img/test5.png",
};

export function getResourceIconSrc(type: keyof typeof resourceIconSources): string
{
  return new URL(resourceIconSources[type], baseUrl).toString();
}
