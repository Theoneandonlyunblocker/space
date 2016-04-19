import app from "./App";
import Unit from "./Unit";


export default function getNullFormation(): Unit[][]
{
  const nullFormation: Unit[][] = [];

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

  return nullFormation;
}
