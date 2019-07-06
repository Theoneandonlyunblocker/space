import {ItemTemplate} from "../../../src/templateinterfaces/ItemTemplate";
import {TemplateCollection} from "../../../src/templateinterfaces/TemplateCollection";

import
{
  bombAttack,
  guardRow,
} from "../abilities/abilities";
import
{
  overdrive,
} from "../passiveskills/passiveSkills";

import {getIconSrc} from "./resources";


export const bombLauncher1: ItemTemplate =
{
  type: "bombLauncher1",
  displayName: "Bomb Launcher 1",
  description: "",
  getIconSrc: getIconSrc.bind(null, "cannon"),

  techLevel: 1,
  buildCost: 100,
  kind: "item",

  slot: "high",
  ability: bombAttack,
};
export const bombLauncher2: ItemTemplate =
{
  type: "bombLauncher2",
  displayName: "Bomb Launcher 2",
  description: "",
  getIconSrc: getIconSrc.bind(null, "cannon"),

  techLevel: 2,
  buildCost: 200,
  kind: "item",

  attributeAdjustments:
  {
    attack: {flat: 1},
  },

  slot: "high",
  ability: bombAttack,
};
export const bombLauncher3: ItemTemplate =
{
  type: "bombLauncher3",
  displayName: "Bomb Launcher 3",
  description: "",
  getIconSrc: getIconSrc.bind(null, "cannon"),

  techLevel: 3,
  buildCost: 300,
  kind: "item",

  attributeAdjustments:
  {
    attack: {flat: 3},
  },

  slot: "high",
  ability: bombAttack,
};

export const afterBurner1: ItemTemplate =
{
  type: "afterBurner1",
  displayName: "Afterburner 1",
  description: "",
  getIconSrc: getIconSrc.bind(null, "blueThing"),

  techLevel: 1,
  buildCost: 100,
  kind: "item",

  attributeAdjustments:
  {
    speed: {flat: 1},
  },

  slot: "mid",
  passiveSkill: overdrive,
};
export const afterBurner2: ItemTemplate =
{
  type: "afterBurner2",
  displayName: "Afterburner 2",
  description: "",
  getIconSrc: getIconSrc.bind(null, "blueThing"),

  techLevel: 2,
  buildCost: 200,
  kind: "item",

  attributeAdjustments:
  {
    speed: {flat: 2},
  },

  slot: "mid",
};
export const afterBurner3: ItemTemplate =
{
  type: "afterBurner3",
  displayName: "Afterburner 3",
  description: "",
  getIconSrc: getIconSrc.bind(null, "blueThing"),

  techLevel: 3,
  buildCost: 300,
  kind: "item",

  attributeAdjustments:
  {
    maxActionPoints: {flat: 1},
    speed: {flat: 3},
  },

  slot: "mid",
};
export const shieldPlating1: ItemTemplate =
{
  type: "shieldPlating1",
  displayName: "Shield Plating 1",
  description: "",
  getIconSrc: getIconSrc.bind(null, "armor"),

  techLevel: 1,
  buildCost: 100,
  kind: "item",

  attributeAdjustments:
  {
    defence: {flat: 1},
  },

  slot: "low",
};
export const shieldPlating2: ItemTemplate =
{
  type: "shieldPlating2",
  displayName: "Shield Plating 2",
  description: "",
  getIconSrc: getIconSrc.bind(null, "armor"),

  techLevel: 2,
  buildCost: 200,
  kind: "item",

  attributeAdjustments:
  {
    defence: {flat: 2},
  },

  slot: "low",
};
export const shieldPlating3: ItemTemplate =
{
  type: "shieldPlating3",
  displayName: "Shield Plating 3",
  description: "",
  getIconSrc: getIconSrc.bind(null, "armor"),

  techLevel: 3,
  buildCost: 300,
  kind: "item",

  attributeAdjustments:
  {
    defence: {flat: 3},
    speed: {flat: -1},
  },

  slot: "low",
  ability: guardRow,
};

export const itemTemplates: TemplateCollection<ItemTemplate> =
{
  [bombLauncher1.type]: bombLauncher1,
  [bombLauncher2.type]: bombLauncher2,
  [bombLauncher3.type]: bombLauncher3,
  [afterBurner1.type]: afterBurner1,
  [afterBurner2.type]: afterBurner2,
  [afterBurner3.type]: afterBurner3,
  [shieldPlating1.type]: shieldPlating1,
  [shieldPlating2.type]: shieldPlating2,
  [shieldPlating3.type]: shieldPlating3,
};
