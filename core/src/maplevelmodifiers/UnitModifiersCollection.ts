import { MapLevelModifiersCollection } from "./MapLevelModifiersCollection";
import { Unit } from "../unit/Unit";
import { squashMapLevelModifiers, getBaseMapLevelModifier, MapLevelModifier } from "./MapLevelModifiers";
import { app } from "../app/App";
import { Star } from "../map/Star";
import { Player } from "../player/Player";
import { MapLevelModifiersPropagationWithoutId } from "./ModifierPropagation";
import { UnitModifiers } from "./UnitModifiers";


export class UnitModifiersCollection extends MapLevelModifiersCollection<UnitModifiers>
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

    const selfModifiers = activeModifiers.map(modifiers => modifiers.self);
    const squashedSelfModifiers = squashMapLevelModifiers(getBaseMapLevelModifier(), ...selfModifiers);

    return squashedSelfModifiers;
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
  public handleOwnerChange(): void
  {
    this.removeAllIncomingModifiers();
    this.depropagateOriginatedModifiers();
    this.propagateOriginatedModifiers();
    this.location.modifiers.propagateModifiersOfTypeTo("localUnits", this);
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

  protected modifierPassesFilter(modifier: UnitModifiers): boolean
  {
    return !modifier.filter || modifier.filter(this.unit);
  }
  protected getPropagationsFor(toPropagate: UnitModifiers)
  {
    const propagations: MapLevelModifiersPropagationWithoutId<UnitModifiers, any>[] = [];

    if (toPropagate.localStar)
    {
      propagations.push(
      {
        modifier: toPropagate.localStar,
        targetType: "localStar",
        target: this.unit.fleet.location.modifiers,
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
        target: this.unit.fleet.player.modifiers,
      });
    }

    return propagations;
  }
}
