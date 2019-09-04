import {MessageFormatLocalizer} from "../../../../src/localization/MessageFormatLocalizer";
import {englishLanguage} from "../../../englishlanguage/englishLanguage";
import {unitEffects as en_unitEffects} from "./en/unitEffects";
import {UnitEffectsMessageArgs} from "./UnitEffectsMessageArgs";


const allMessages =
{
  ...en_unitEffects,
};

export const localizer = new MessageFormatLocalizer<UnitEffectsMessageArgs>("spaceUnitEffects");
localizer.setAll(allMessages, englishLanguage);

export const localize = localizer.localize.bind(localizer);
