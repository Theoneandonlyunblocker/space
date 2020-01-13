import {GameModule} from "core/src/modules/GameModule";
import * as semver from "core/src/generic/versions";
import * as debug from "core/src/app/debug";

import {englishLanguage} from "modules/englishlanguage/src/englishLanguage";

import * as moduleInfo from "../moduleInfo.json";
import { moneyResource } from "./moneyResource";


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
      "resources",
    );
  },
  // TODO 2019.10.04 | these never get triggered since this module isn't part of saves
  // need to add some way of modules to define dependencies to load this module in
  reviveGameData: saveData =>
  {
    const dataVersion = saveData.appVersion;

    if (semver.lt(dataVersion, "0.5.2"))
    {
      debug.log("saves", `Executing stored core save data reviver function 'convertPlayerMoneyToResources'`);
      convertPlayerMoneyToResources(saveData);

      debug.log("saves", `Executing stored core save data reviver function 'convertStarBaseIncomeToResources'`);
      convertStarBaseIncomeToResources(saveData);
    }
  }
};

function convertPlayerMoneyToResources(saveData: any): void
{
  saveData.gameData.players.forEach((playerSaveData: any) =>
  {
    playerSaveData.resources[moneyResource.type] = playerSaveData.money;
    delete playerSaveData.money;
  });
}
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
