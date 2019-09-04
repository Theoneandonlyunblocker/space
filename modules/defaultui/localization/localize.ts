import {MessageFormatLocalizer} from "../../../src/localization/MessageFormatLocalizer";

import {englishLanguage} from "../../englishlanguage/englishLanguage";
import {formatters as englishFormatters} from "../../englishlanguage/formatters";

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

import {Battle as Battle_args} from "./messageArgs/battle";
import {Diplomacy as Diplomacy_args} from "./messageArgs/diplomacy";
import {Errors as Errors_args} from "./messageArgs/errors";
import {Fleet as Fleet_args} from "./messageArgs/fleet";
import {GalaxyMapUI as GalaxyMapUI_args} from "./messageArgs/galaxyMapUI";
import {GameOver as GameOver_args} from "./messageArgs/gameOver";
import {General as General_args} from "./messageArgs/general";
import {Items as Items_args} from "./messageArgs/items";
import {Notifications as Notifications_args} from "./messageArgs/notifications";
import {Options as Options_args} from "./messageArgs/options";
import {Player as Player_args} from "./messageArgs/player";
import {Production as Production_args} from "./messageArgs/production";
import {Saves as Saves_args} from "./messageArgs/saves";
import {SetupGame as SetupGame_args} from "./messageArgs/setupGame";
import {Trade as Trade_args} from "./messageArgs/trade";
import {Technology as Technology_args} from "./messageArgs/technology";
import {Unit as Unit_args} from "./messageArgs/unit";
import {UnitUpgrade as UnitUpgrade_args} from "./messageArgs/unitUpgrade";


export type UiMessageArgs =
  Battle_args &
  Diplomacy_args &
  Errors_args &
  Fleet_args &
  GalaxyMapUI_args &
  GameOver_args &
  General_args &
  Items_args &
  Notifications_args &
  Options_args &
  Player_args &
  Production_args &
  Saves_args &
  SetupGame_args &
  Trade_args &
  Technology_args &
  Unit_args &
  UnitUpgrade_args ;

const mergedMessages =
{
  ...en_battle,
  ...en_diplomacy,
  ...en_errors,
  ...en_fleet,
  ...en_galaxyMapUI,
  ...en_gameOver,
  ...en_general,
  ...en_items,
  ...en_notifications,
  ...en_options,
  ...en_player,
  ...en_production,
  ...en_saves,
  ...en_setupGame,
  ...en_trade,
  ...en_technology,
  ...en_unit,
  ...en_unitUpgrade,
};

export const localizer = new MessageFormatLocalizer<UiMessageArgs>("ui");
localizer.addFormatters(englishFormatters, englishLanguage);
localizer.setAll(mergedMessages, englishLanguage);

export const localize = localizer.localize.bind(localizer);
