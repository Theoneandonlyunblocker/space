import {englishLanguage} from "../../../englishlanguage/englishLanguage";
import {Localizer} from "../../../../src/localization/Localizer";

import {names as en_names} from "./en/names";


export const nameLocalizer = new Localizer<typeof en_names>("spaceRaceNames");
nameLocalizer.setAll(en_names, englishLanguage);
export const localizeName = nameLocalizer.localize.bind(nameLocalizer);
