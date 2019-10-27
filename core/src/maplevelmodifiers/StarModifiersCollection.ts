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
    this.depropagateOriginatedModifiers();
    this.propagateOriginatedModifiers();
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
        propagations.push(
        {
          template: toPropagate.propagations.localUnits,
          target: unit.mapLevelModifiers,
        });
      });
    }
    if (toPropagate.propagations && toPropagate.propagations.global)
    {
      propagations.push(
      {
        template: toPropagate.propagations.global,
        target: app.game.globalModifiers,
      });
    }
    if (toPropagate.propagations && toPropagate.propagations.owningPlayer)
    {
      propagations.push(
      {
        template: toPropagate.propagations.owningPlayer,
        target: this.star.owner.modifiers,
      });
    }

    return propagations;
  }
}
