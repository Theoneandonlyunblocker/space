import * as Languages from "./defaultLanguages";

import {Localizer} from "../src/localization/Localizer";

import {battle as en_battle} from "./en/battle";
import {general as en_general} from "./en/general";
import {items as en_items} from "./en/items";
import {options as en_options} from "./en/options";
import {player as en_player} from "./en/player";
import {saves as en_saves} from "./en/saves";
import {setupGame as en_setupGame} from "./en/setupGame";
import {trade as en_trade} from "./en/trade";
import {unit as en_unit} from "./en/unit";
import {unitUpgrade as en_unitUpgrade} from "./en/unitUpgrade";

import
{
  shallowExtend,
} from "../src/utility";


// TODO 2017.07.18 | sort out capitalization for all these...
type mergedType =
  typeof en_battle &
  typeof en_general &
  typeof en_items &
  typeof en_options &
  typeof en_player &
  typeof en_saves &
  typeof en_setupGame &
  typeof en_trade &
  typeof en_unit &
  typeof en_unitUpgrade;

export const localizer = new Localizer<mergedType>("ui");

const mergedTexts = shallowExtend<mergedType>(
  en_battle,
  en_general,
  en_items,
  en_options,
  en_player,
  en_saves,
  en_setupGame,
  en_trade,
  en_unit,
  en_unitUpgrade,
);

localizer.registerTexts(mergedTexts, Languages.en);

const boundLocalize: typeof localizer.localize = localizer.localize.bind(localizer);

export function localizeF(key: keyof mergedType, quantity: number | "plural" = 1)
{
  const realQuantity = quantity === "plural" ? 2 : quantity;

  return boundLocalize(key, realQuantity);
}
export function localize(key: keyof mergedType, quantity: number | "plural" = 1)
{
  const realQuantity = quantity === "plural" ? 2 : quantity;

  return boundLocalize(key, realQuantity).format();
}
