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
        propagations.push(...toPropagate.propagations.ownedStars.map(modifierTemplate =>
        {
          return {
            template: modifierTemplate,
            target: location.modifiers,
          }
        }));
      });
    }
    if (toPropagate.propagations && toPropagate.propagations.ownedUnits)
    {
      this.player.units.forEach(unit =>
      {
        propagations.push(...toPropagate.propagations.ownedUnits.map(modifierTemplate =>
        {
          return {
            template: modifierTemplate,
            target: unit.mapLevelModifiers,
          }
        }));
      });
    }

    return propagations;
  }
}
