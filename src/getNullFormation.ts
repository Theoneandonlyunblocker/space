import app from "./App";
import Unit from "./Unit";

export default function getNullFormation(): Unit[][]
{
  const nullFormation: Unit[][] = [];

  const rows = activeModuleData.ruleSet.battle.rowsPerFormation;
  const columns = activeModuleData.ruleSet.battle.cellsPerRow;
  for (let i = 0; i < rows; i++)
  {
    nullFormation.push([]);
    for (let j = 0; j < columns; j++)
    {
      nullFormation[i].push(null);
    }
  }

  return nullFormation;
}
