import { MapLevelModifiersCollection } from "./MapLevelModifiersCollection";
import { Game } from "../game/Game";
import { MapLevelModifiersPropagationWithoutId } from "./ModifierPropagation";
import { GlobalModifier } from "./GlobalModifier";


export class GlobalModifiersCollection extends MapLevelModifiersCollection<GlobalModifier>
{
  private game: Game;

  constructor(game: Game)
  {
    super();

    this.game = game;
  }

  protected modifierPassesFilter(modifier: GlobalModifier): boolean
  {
    return true;
  }
  protected getPropagationsFor(toPropagate: GlobalModifier)
  {
    const propagations: MapLevelModifiersPropagationWithoutId<GlobalModifier>[] = [];

    if (toPropagate.propagations && toPropagate.propagations.stars)
    {
      this.game.galaxyMap.stars.forEach(location =>
      {
        propagations.push(
        {
          modifier: toPropagate.propagations.stars,
          targetType: "stars",
          target: location.modifiers,
        });
      });
    }
    if (toPropagate.propagations && toPropagate.propagations.units)
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
          modifier: toPropagate.propagations.units,
          targetType: "units",
          target: unit.mapLevelModifiers,
        });
      });
    }

    return propagations;
  }
}
