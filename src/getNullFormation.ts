import RuleSet from "./RuleSet";
import Unit from "./Unit";


export default function getNullFormation(): Unit[][]
{
  const nullFormation: Unit[][] = [];

  var rows = RuleSet.battle.rowsPerFormation;
  var columns = RuleSet.battle.cellsPerRow;
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
