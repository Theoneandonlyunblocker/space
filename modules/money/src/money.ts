import {GameModule} from "core/src/modules/GameModule";

import {englishLanguage} from "modules/englishlanguage/src/englishLanguage";

import * as moduleInfo from "../moduleInfo.json";
import { moneyResource } from "./moneyResource.js";


export const money: GameModule =
{
  info: moduleInfo,
  supportedLanguages: [englishLanguage],
  addToModuleData: moduleData =>
  {
    moduleData.copyTemplates(
    {
      [moneyResource.type]: moneyResource,
    },
      "Resources",
    );
  }
};
