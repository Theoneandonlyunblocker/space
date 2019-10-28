import { MapLevelModifiersCollection } from "./MapLevelModifiersCollection";
import { Star } from "../map/Star";
import { squashMapLevelModifiers, getBaseMapLevelModifier, MapLevelModifier } from "./MapLevelModifiers";
import { app } from "../app/App";
import { SimpleMapLevelModifiersPropagation } from "./ModifierPropagation";
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
    const activeModifiers = this.getAllActiveModifiers();

    const selfModifiers = activeModifiers.filter(modifier => modifier.template.self).map(modifiers => modifiers.template.self);
    const squashedSelfModifiers = squashMapLevelModifiers(getBaseMapLevelModifier(), ...selfModifiers);

    return squashedSelfModifiers;
  }
  public handleOwnerChange(): void
  {
    this.removeAllIncomingModifiers();
    this.recheckAllModifiers();
    this.star.buildings.forEach(building =>
    {
      building.modifiers.propagateModifiersOfTypeTo("localStar", this);
    });
    this.star.owner.modifiers.propagateModifiersOfTypeTo("ownedStars", this);
    app.game.globalModifiers.propagateModifiersOfTypeTo("stars", this);
    this.star.getUnits().forEach(unit =>
    {
      unit.mapLevelModifiers.propagateModifiersOfTypeTo("localStar", this);
    });
  }

  protected templateShouldBeActive(modifier: StarModifier): boolean
  {
    return !modifier.filter || modifier.filter(this.star);
  }
  protected getPropagationsForTemplate(toPropagate: StarModifier)
  {
    const propagations: SimpleMapLevelModifiersPropagation<StarModifier>[] = [];

    if (toPropagate.propagations && toPropagate.propagations.localUnits)
    {
      this.star.getUnits().forEach(unit =>
      {
        propagations.push(...toPropagate.propagations.localUnits.map(modifierTemplate =>
        {
          return {
            template: modifierTemplate,
            target: unit.mapLevelModifiers,
          };
        }));
      });
    }
    if (toPropagate.propagations && toPropagate.propagations.global)
    {
      propagations.push(...toPropagate.propagations.global.map(modifierTemplate =>
      {
        return {
          template: modifierTemplate,
          target: app.game.globalModifiers,
        };
      }));
    }
    if (toPropagate.propagations && toPropagate.propagations.owningPlayer)
    {
      propagations.push(...toPropagate.propagations.owningPlayer.map(modifierTemplate =>
      {
        return {
          template: modifierTemplate,
          target: this.star.owner.modifiers,
        };
      }));
    }

    return propagations;
  }
}
