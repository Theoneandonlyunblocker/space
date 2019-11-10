import {StringLocalizer} from "core/src/localization/StringLocalizer";
import {Localizer} from "core/src/localization/Localizer";
import { Name } from "core/src/localization/Name";
import {englishLanguage} from "modules/englishlanguage/src/englishLanguage";

import {abilities as en_abilities} from "./en/abilities";
import {buildings as en_buildings} from "./en/buildings";
import {items as en_items} from "./en/items";
import {mapGen as en_mapGen} from "./en/mapGen";
import {mapLayers as en_mapLayers} from "./en/mapLayers";
import {mapModes as en_mapModes} from "./en/mapModes";
import {passiveSkills as en_passiveSkills} from "./en/passiveSkills";
import {resources as en_resources} from "./en/resources";
import {technologies as en_technologies} from "./en/technologies";
import {terrains as en_terrains} from "./en/terrains";
import {units as en_units} from "./en/units";
import {unitEffects as en_unitEffects} from "./en/unitEffects";
import {titanComponents as en_titanComponents} from "./en/titanComponents";

import {names as en_names} from "./en/names";


const allStrings =
{
  ...en_abilities,
  ...en_buildings,
  ...en_items,
  ...en_mapGen,
  ...en_mapLayers,
  ...en_mapModes,
  ...en_passiveSkills,
  ...en_resources,
  ...en_technologies,
  ...en_terrains,
  ...en_units,
  ...en_unitEffects,
  ...en_titanComponents,
};

export const localizer = new StringLocalizer<typeof allStrings>("space");
localizer.setAll(allStrings, englishLanguage);

export const localize = localizer.localize.bind(localizer);


const allNames =
{
  ...en_names,
};

type GenericNamesType = {[K in keyof typeof allNames]: (...args: Parameters<typeof allNames[K]>) => Name};

export const nameLocalizer = new Localizer<GenericNamesType, () => Name>(
  "space",
  (nameKey, language, missingLocalizationString) =>
  {
    return () => language.constructName(missingLocalizationString);
  },
);
nameLocalizer.setAll(en_names, englishLanguage);

export const localizeName = nameLocalizer.localize.bind(nameLocalizer);
