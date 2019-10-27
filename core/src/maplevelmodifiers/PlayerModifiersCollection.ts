import { MapLevelModifiersCollection } from "./MapLevelModifiersCollection";
import { Player } from "../player/Player";
import { SimpleMapLevelModifiersPropagation } from "./ModifierPropagation";
import { PlayerModifier } from "./PlayerModifier";


export class PlayerModifiersCollection extends MapLevelModifiersCollection<PlayerModifier>
{
  private player: Player;

  constructor(player: Player)
  {
    super();

    this.player = player;
  }

  protected templateShouldBeActive(modifier: PlayerModifier): boolean
  {
    return true;
  }
  protected getPropagationsForTemplate(toPropagate: PlayerModifier)
  {
    const propagations: SimpleMapLevelModifiersPropagation<PlayerModifier>[] = [];

    if (toPropagate.propagations && toPropagate.propagations.ownedStars)
    {
      this.player.controlledLocations.forEach(location =>
      {
        propagations.push(
        {
          template: toPropagate.propagations.ownedStars,
          target: location.modifiers,
        });
      });
    }
    if (toPropagate.propagations && toPropagate.propagations.ownedUnits)
    {
      this.player.units.forEach(unit =>
      {
        propagations.push(
        {
          template: toPropagate.propagations.ownedUnits,
          target: unit.mapLevelModifiers,
        });
      });
    }

    return propagations;
  }
}
