import { MapLevelModifiersCollection } from "./MapLevelModifiersCollection";
import { Player } from "../player/Player";
import { MapLevelModifiersPropagationWithoutId } from "./ModifierPropagation";
import { PlayerModifier } from "./PlayerModifier";


export class PlayerModifiersCollection extends MapLevelModifiersCollection<PlayerModifier>
{
  private player: Player;

  constructor(player: Player)
  {
    super();

    this.player = player;
  }

  protected modifierPassesFilter(modifier: PlayerModifier): boolean
  {
    return true;
  }
  protected getPropagationsFor(toPropagate: PlayerModifier)
  {
    const propagations: MapLevelModifiersPropagationWithoutId<PlayerModifier>[] = [];

    if (toPropagate.propagations && toPropagate.propagations.ownedStars)
    {
      this.player.controlledLocations.forEach(location =>
      {
        propagations.push(
        {
          modifier: toPropagate.propagations.ownedStars,
          targetType: "ownedStars",
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
          modifier: toPropagate.propagations.ownedUnits,
          targetType: "ownedUnits",
          target: unit.mapLevelModifiers,
        });
      });
    }

    return propagations;
  }
}
