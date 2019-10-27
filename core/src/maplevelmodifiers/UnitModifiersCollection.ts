import { MapLevelModifiersCollection } from "./MapLevelModifiersCollection";
import { Unit } from "../unit/Unit";
import { squashMapLevelModifiers, getBaseMapLevelModifier, MapLevelModifier } from "./MapLevelModifiers";
import { app } from "../app/App";
import { Star } from "../map/Star";
import { Player } from "../player/Player";
import { SimpleMapLevelModifiersPropagation } from "./ModifierPropagation";
import { UnitModifier } from "./UnitModifier";


export class UnitModifiersCollection extends MapLevelModifiersCollection<UnitModifier>
{
  private unit: Unit;
  private get location(): Star
  {
    return this.unit.fleet.location;
  }
  private get owner(): Player
  {
    return this.unit.fleet.player;
  }

  constructor(unit: Unit)
  {
    super();

    this.unit = unit;
  }

  public getSelfModifiers(): MapLevelModifier
  {
    const activeModifiers = this.getAllActiveModifiers();

    const selfModifiers = activeModifiers.filter(modifier => modifier.template.self).map(modifier => modifier.template.self);
    const squashedSelfModifiers = squashMapLevelModifiers(getBaseMapLevelModifier(), ...selfModifiers);

    return squashedSelfModifiers;
  }
  public handleConstruct(): void
  {
    if (this.unit.template.mapLevelModifier)
    {
      this.addOriginatingModifier(this.unit.template.mapLevelModifier);
      this.propagateOriginatedModifiers();
    }

    this.propagateModifiersOfTypeTo("global", app.game.globalModifiers);
    app.game.globalModifiers.propagateModifiersOfTypeTo("units", this);
  }
  public clearModifiersForLocation(): void
  {
    this.removePropagationsTo(this.location.modifiers);
    this.location.modifiers.removePropagationsTo(this);
  }
  public setModifiersForLocation(): void
  {
    this.propagateModifiersOfTypeTo("localStar", this.location.modifiers);
    this.location.modifiers.propagateModifiersOfTypeTo("localUnits", this);
  }
  public clearModifiersForOwner(): void
  {
    this.removePropagationsTo(this.owner.modifiers);
    this.owner.modifiers.removePropagationsTo(this);
  }
  public setModifiersForOwner(): void
  {
    this.propagateModifiersOfTypeTo("owningPlayer", this.owner.modifiers);
    this.owner.modifiers.propagateModifiersOfTypeTo("ownedUnits", this);
  }
  public handleUpgrade(): void
  {
    this.recheckIncomingModifiers();
  }
  public handleDestroy(): void
  {
    this.removeAllModifiers();
  }

  protected templateShouldBeActive(modifier: UnitModifier): boolean
  {
    return !modifier.filter || modifier.filter(this.unit);
  }
  protected getPropagationsForTemplate(toPropagate: UnitModifier)
  {
    const propagations: SimpleMapLevelModifiersPropagation<UnitModifier>[] = [];

    if (toPropagate.propagations && toPropagate.propagations.localStar)
    {
      propagations.push(
      {
        template: toPropagate.propagations.localStar,
        target: this.unit.fleet.location.modifiers,
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
        target: this.unit.fleet.player.modifiers,
      });
    }

    return propagations;
  }
}
