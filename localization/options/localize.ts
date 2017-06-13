import * as Languages from "../defaultLanguages";

import {Localizer} from "../../src/localization/Localizer";

import {options as enOptions} from "./en";

export const localizer = new Localizer<typeof enOptions>();
localizer.registerTexts(enOptions, Languages.en);

export const localize: typeof localizer.localize = localizer.localize.bind(localizer);
