import { MapLevelModifiersCollection } from "./MapLevelModifiersCollection";
import { Game } from "../game/Game";
import { SimpleMapLevelModifiersPropagation } from "./ModifierPropagation";
import { GlobalModifier } from "./GlobalModifier";


export class GlobalModifiersCollection extends MapLevelModifiersCollection<GlobalModifier>
{
  private game: Game;

  constructor(game: Game)
  {
    super();

    this.game = game;
  }

  protected templateShouldBeActive(modifier: GlobalModifier): boolean
  {
    return true;
  }
  protected getPropagationsForTemplate(toPropagate: GlobalModifier)
  {
    const propagations: SimpleMapLevelModifiersPropagation<GlobalModifier>[] = [];

    if (toPropagate.propagations && toPropagate.propagations.stars)
    {
      this.game.galaxyMap.stars.forEach(location =>
      {
        propagations.push(
        {
          template: toPropagate.propagations.stars,
          target: location.modifiers,
        });
      });
    }
    if (toPropagate.propagations && toPropagate.propagations.units)
    {
      this.game.getAllUnits().forEach(unit =>
      {
        propagations.push(
        {
          template: toPropagate.propagations.units,
          target: unit.mapLevelModifiers,
        });
      });
    }

    return propagations;
  }
}
