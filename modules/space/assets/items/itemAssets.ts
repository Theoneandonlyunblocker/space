import {baseUrl} from "../baseUrl";


const itemIconSources =
{
  armor: "./assets/items/img/armor.png",
  blueThing: "./assets/items/img/blueThing.png",
  cannon: "./assets/items/img/cannon.png",

  targetingSupercomputer: "./assets/items/img/blueThing.png",
  monoblocArmor: "./assets/items/img/armor.png",
};
const techLevelIconSources =
{
  2: "./assets/items/img/icons/t3icon.png",
  3: "./assets/items/img/icons/t2icon.png",
};

export function getItemIcon(type: keyof typeof itemIconSources, techLevel: number): HTMLDivElement
{
  const container = document.createElement("div");
  container.classList.add("item-icon-wrapper");

  const itemImg = new Image();
  itemImg.src = new URL(itemIconSources[type], baseUrl).toString();
  itemImg.classList.add("item-icon-base");
  itemImg.style.width = "100%";
  itemImg.style.height = "100%";
  itemImg.style.position = "absolute";
  itemImg.style.top = "0";
  itemImg.style.left = "0";
  container.appendChild(itemImg);

  if (techLevel !== 1)
  {
    const techLevelImg = new Image();
    techLevelImg.src = new URL(techLevelIconSources[techLevel], baseUrl).toString();
    techLevelImg.classList.add("item-icon-tech-level");
    techLevelImg.style.position = "absolute";
    techLevelImg.style.top = "0";
    techLevelImg.style.left = "0";
    container.appendChild(techLevelImg);
  }

  return container;
}
