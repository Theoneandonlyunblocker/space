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
    const propagations: MapLevelModifiersPropagationWithoutId<StarModifier, any>[] = [];

    if (toPropagate.localUnits)
    {
      this.star.getUnits().forEach(unit =>
      {
        propagations.push(
        {
          modifier: toPropagate.localUnits,
          targetType: "localUnits",
          target: unit.mapLevelModifiers,
        });
      });
    }
    if (toPropagate.global)
    {
      propagations.push(
      {
        modifier: toPropagate.global,
        targetType: "global",
        target: app.game.globalModifiers,
      });
    }
    if (toPropagate.owningPlayer)
    {
      propagations.push(
      {
        modifier: toPropagate.owningPlayer,
        targetType: "owningPlayer",
        target: this.star.owner.modifiers,
      });
    }

    return propagations;
  }
}
