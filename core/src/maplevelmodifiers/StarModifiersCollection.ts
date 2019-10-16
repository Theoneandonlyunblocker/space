import { MapLevelModifiersCollection } from "./MapLevelModifiersCollection";
import { Star } from "../map/Star";
import { squashMapLevelModifiers, getBaseMapLevelModifier, MapLevelModifier } from "./MapLevelModifiers";
import { app } from "../app/App";
import { MapLevelModifiersPropagationWithoutId } from "./ModifierPropagation";
import { StarModifier } from "./StarModifier";


export class StarModifiersCollection extends MapLevelModifiersCollection<StarModifier>
{
  private star: Star;

  constructor(star: Star)
  {
    super();

    this.star = star;
  }

  public getSelfModifiers(): MapLevelModifier
  {
    const activeModifiers = this.getAllActiveModifiers().filter(modifiers =>
    {
      return !modifiers.filter || modifiers.filter(this.star);
    });

    const selfModifiers = activeModifiers.map(modifiers => modifiers.self);
    const squashedSelfModifiers = squashMapLevelModifiers(getBaseMapLevelModifier(), ...selfModifiers);

    return squashedSelfModifiers;
  }

  protected modifierPassesFilter(modifier: StarModifier): boolean
  {
    return !modifier.filter || modifier.filter(this.star);
  }
  protected getPropagationsFor(toPropagate: StarModifier)
  {
    const propagations: MapLevelModifiersPropagationWithoutId<StarModifier>[] = [];

    if (toPropagate.propagations && toPropagate.propagations.localUnits)
    {
      this.star.getUnits().forEach(unit =>
      {
        propagations.push(
        {
          modifier: toPropagate.propagations.localUnits,
          targetType: "localUnits",
          target: unit.mapLevelModifiers,
        });
      });
    }
    if (toPropagate.propagations && toPropagate.propagations.global)
    {
      propagations.push(
      {
        modifier: toPropagate.propagations.global,
        targetType: "global",
        target: app.game.globalModifiers,
      });
    }
    if (toPropagate.propagations && toPropagate.propagations.owningPlayer)
    {
      propagations.push(
      {
        modifier: toPropagate.propagations.owningPlayer,
        targetType: "owningPlayer",
        target: this.star.owner.modifiers,
      });
    }

    return propagations;
  }
}
