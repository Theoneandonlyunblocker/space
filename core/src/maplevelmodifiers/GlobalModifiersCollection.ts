import { MapLevelModifiersCollection } from "./MapLevelModifiersCollection";
import { Game } from "../game/Game";
import { MapLevelModifiersPropagationWithoutId } from "./ModifierPropagation";
import { GlobalModifiers } from "./GlobalModifiers";


export class GlobalModifiersCollection extends MapLevelModifiersCollection<GlobalModifiers>
{
  private game: Game;

  constructor(game: Game)
  {
    super();

    this.game = game;
  }

  protected modifierPassesFilter(modifier: GlobalModifiers): boolean
  {
    return true;
  }
  protected getPropagationsFor(toPropagate: GlobalModifiers)
  {
    const propagations: MapLevelModifiersPropagationWithoutId<GlobalModifiers, any>[] = [];

    if (toPropagate.stars)
    {
      this.game.galaxyMap.stars.forEach(location =>
      {
        propagations.push(
        {
          modifier: toPropagate.stars,
          targetType: "stars",
          target: location.modifiers,
        });
      });
    }
    if (toPropagate.units)
    {
      const allUnitsInGame = this.game.players.map(player => player.units).reduce((allUnits, playerUnits) =>
      {
        allUnits.push(...playerUnits);

        return allUnits;
      }, []);

      allUnitsInGame.forEach(unit =>
      {
        propagations.push(
        {
          modifier: toPropagate.units,
          targetType: "units",
          target: unit.mapLevelModifiers,
        });
      });
    }

    return propagations;
  }
}
