import { Battle } from "core/src/battle/Battle";
import { activeModuleData } from "core/src/app/activeModuleData";
import { Player } from "core/src/player/Player";
import { randInt } from "core/src/generic/utility";
import { Star } from "core/src/map/Star";
import { Unit } from "core/src/unit/Unit";
import { CombatManager } from "core/src/combat/CombatManager";


export function generateRandomBattle(useAiPlayers: boolean): Battle
{
  const player1 = generateRandomPlayer(useAiPlayers);
  const player2 = generateRandomPlayer(useAiPlayers);

  const side1Units: Unit[] = [];
  const side2Units: Unit[] = [];

  [side1Units, side2Units].forEach(units =>
  {
    const unitCount = randInt(3, 6);
    for (let i = 0; i < unitCount; i++)
    {
      units.push(generateRandomUnit());
    }
  });

  side1Units.forEach(unit => player1.addUnit(unit));
  side2Units.forEach(unit => player2.addUnit(unit));

  const location = new Star(
  {
    x: 69,
    y: 420,
  });

  return new Battle(
  {
    battleData:
    {
      location: location,
      building: null,
      attacker:
      {
        player: player1,
        units: side1Units,
      },
      defender:
      {
        player: player2,
        units: side2Units,
      },
    },
    combatManager: new CombatManager(),

    side1: makeFormation(side1Units),
    side2: makeFormation(side2Units),

    side1Player: player1,
    side2Player: player2,
  });
}

function generateRandomPlayer(isAi: boolean): Player
{
  const race = activeModuleData.templates.races.getRandom();

  return new Player(
  {
    isAi: isAi,
    isIndependent: race.isNotPlayable,
    race: race,
  });
}

function generateRandomUnit(): Unit
{
  const template = activeModuleData.templates.units.getRandom();

  return Unit.fromTemplate(
  {
    template: template,
    race: activeModuleData.templates.races.getRandom(),
  });
}

function makeFormation(units: Unit[]): Unit[][]
{
  const formation: Unit[][] = [];
  let unitsIndex: number = 0;

  for (let i = 0; i < 2; i++)
  {
    formation.push([]);
    for (let j = 0; j < 3; j++)
    {
      const unitToAdd = units[unitsIndex] ? units[unitsIndex] : null;
      formation[i].push(unitToAdd);
      unitsIndex++;
    }
  }

  return formation;
}
