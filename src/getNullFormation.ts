import app from "./App";
import Unit from "./Unit";

let nullFormation: Unit[][];

export default function getNullFormation()
{
  if (!nullFormation)
  {
    nullFormation = [];

    var rows = app.moduleData.ruleSet.battle.rowsPerFormation;
    var columns = app.moduleData.ruleSet.battle.cellsPerRow;
    for (let i = 0; i < rows; i++)
    {
      nullFormation.push([]);
      for (let j = 0; j < columns; j++)
      {
        nullFormation[i].push(null);
      }
    }
  }

  return nullFormation.slice();
}

export function reset()
{
  nullFormation = null;
}
