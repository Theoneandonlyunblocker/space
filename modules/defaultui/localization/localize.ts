import {Localizer} from "../../../src/localization/Localizer";
import
{
  shallowExtend,
} from "../../../src/generic/utility";

import {englishLanguage} from "../../englishlanguage/englishLanguage";

import {battle as en_battle} from "./en/battle";
import {diplomacy as en_diplomacy} from "./en/diplomacy";
import {errors as en_errors} from "./en/errors";
import {fleet as en_fleet} from "./en/fleet";
import {galaxyMapUI as en_galaxyMapUI} from "./en/galaxyMapUI";
import {gameOver as en_gameOver} from "./en/gameOver";
import {general as en_general} from "./en/general";
import {items as en_items} from "./en/items";
import {notifications as en_notifications} from "./en/notifications";
import {options as en_options} from "./en/options";
import {player as en_player} from "./en/player";
import {production as en_production} from "./en/production";
import {saves as en_saves} from "./en/saves";
import {setupGame as en_setupGame} from "./en/setupGame";
import {trade as en_trade} from "./en/trade";
import {technology as en_technology} from "./en/technology";
import {unit as en_unit} from "./en/unit";
import {unitUpgrade as en_unitUpgrade} from "./en/unitUpgrade";


export type AllMessages =
  typeof en_battle &
  typeof en_diplomacy &
  typeof en_errors &
  typeof en_fleet &
  typeof en_galaxyMapUI &
  typeof en_gameOver &
  typeof en_general &
  typeof en_items &
  typeof en_notifications &
  typeof en_options &
  typeof en_player &
  typeof en_production &
  typeof en_saves &
  typeof en_setupGame &
  typeof en_trade &
  typeof en_technology &
  typeof en_unit &
  typeof en_unitUpgrade;

export const localizer = new Localizer<AllMessages>("ui");

const mergedMessages = shallowExtend<AllMessages>(
  en_battle,
  en_diplomacy,
  en_errors,
  en_fleet,
  en_galaxyMapUI,
  en_gameOver,
  en_general,
  en_items,
  en_notifications,
  en_options,
  en_player,
  en_production,
  en_saves,
  en_setupGame,
  en_trade,
  en_technology,
  en_unit,
  en_unitUpgrade,
);

localizer.setAllMessages(mergedMessages, englishLanguage);

export const localize = <typeof localizer.localize> localizer.localize.bind(localizer);
