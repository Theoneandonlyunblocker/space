import {GameModule} from "core/src/modules/GameModule";
import * as semver from "core/src/generic/versions";
import * as debug from "core/src/app/debug";

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
  },
  reviveGameData: saveData =>
  {
    const dataVersion = saveData.appVersion;

    if (semver.lt(dataVersion, "0.5.2"))
    {

      debug.log("saves", `Executing stored core save data reviver function 'convertStarBaseIncomeToResources'`);
      convertStarBaseIncomeToResources(saveData);
    }
  }
};
function convertStarBaseIncomeToResources(saveData: any): void
{
  saveData.gameData.galaxyMap.stars.forEach((starSaveData: any) =>
  {
    const baseMoneyIncome = starSaveData.baseIncome;
    starSaveData.baseIncome =
    {
      [moneyResource.type]: baseMoneyIncome,
    };
  });
}
