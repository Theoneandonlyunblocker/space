import * as Languages from "./defaultLanguages";

import {Localizer} from "../src/localization/Localizer";

import {battle as en_battle} from "./en/battle";
import {general as en_general} from "./en/general";
import {items as en_items} from "./en/items";
import {options as en_options} from "./en/options";
import {player as en_player} from "./en/player";
import {setupGame as en_setupGame} from "./en/setupGame";
import {trade as en_trade} from "./en/trade";
import {unit as en_unit} from "./en/unit";
import {unitUpgrade as en_unitUpgrade} from "./en/unitUpgrade";

type mergedType =
  typeof en_battle &
  typeof en_general &
  typeof en_items &
  typeof en_options &
  typeof en_player &
  typeof en_setupGame &
  typeof en_trade &
  typeof en_unit &
  typeof en_unitUpgrade;

export const localizer = new Localizer<mergedType>("defaultLocalize");

localizer.appendTexts(en_battle, Languages.en);
localizer.appendTexts(en_general, Languages.en);
localizer.appendTexts(en_items, Languages.en);
localizer.appendTexts(en_options, Languages.en);
localizer.appendTexts(en_player, Languages.en);
localizer.appendTexts(en_setupGame, Languages.en);
localizer.appendTexts(en_trade, Languages.en);
localizer.appendTexts(en_unit, Languages.en);
localizer.appendTexts(en_unitUpgrade, Languages.en);

export const localizeF: typeof localizer.localize = localizer.localize.bind(localizer);
export function localize(key: keyof mergedType, quantity: number = 1): string
{
  return localizeF(key, quantity).format();
}
