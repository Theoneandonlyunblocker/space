import { MapLevelModifiersCollection } from "./MapLevelModifiersCollection";
import { Player } from "../player/Player";
import { MapLevelModifiersPropagationWithoutId } from "./ModifierPropagation";
import { PlayerModifiers } from "./PlayerModifiers";


export class PlayerModifiersCollection extends MapLevelModifiersCollection<PlayerModifiers>
{
  private player: Player;

  constructor(player: Player)
  {
    super();

    this.player = player;
  }

  protected modifierPassesFilter(modifier: PlayerModifiers): boolean
  {
    return true;
  }
  protected getPropagationsFor(toPropagate: PlayerModifiers)
  {
    const propagations: MapLevelModifiersPropagationWithoutId<PlayerModifiers, any>[] = [];

    if (toPropagate.ownedStars)
    {
      this.player.controlledLocations.forEach(location =>
      {
        propagations.push(
        {
          modifier: toPropagate.ownedStars,
          targetType: "ownedStars",
          target: location.modifiers,
        });
      });
    }
    if (toPropagate.ownedUnits)
    {
      this.player.units.forEach(unit =>
      {
        propagations.push(
        {
          modifier: toPropagate.ownedUnits,
          targetType: "ownedUnits",
          target: unit.mapLevelModifiers,
        });
      });
    }

    return propagations;
  }
}
