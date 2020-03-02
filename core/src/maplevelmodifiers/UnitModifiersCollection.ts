import { MapLevelModifiersCollection } from "./MapLevelModifiersCollection";
import { Unit } from "../unit/Unit";
import { squashMapLevelModifiers, MapLevelModifier } from "./MapLevelModifiers";
import { app } from "../app/App";
import { Star } from "../map/Star";
import { Player } from "../player/Player";
import { SimpleMapLevelModifiersPropagation } from "./ModifierPropagation";
import { UnitModifier, UnitModifierAdjustments, getBaseUnitSelfModifier } from "./UnitModifier";
import { onMapPresentModifierChange, onIncomeModifierChange } from "./onModifierChangeTriggers";
import { activeModuleData } from "../app/activeModuleData";
import { flatten2dArray } from "../generic/utility";
import { AdjustmentsMap } from "../generic/AdjustmentsMap";
import { UnitBattlePrepEffect } from "../battleprep/UnitBattlePrepEffect";
import { getBattlePrepEffectsFromModifiers } from "../battleprep/battlePrepEffectUtils";


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
    this.onChange = changedModifiers =>
    {
      const allSelfModifiers = changedModifiers.filter(modifier => modifier.template.self).map(modifier => modifier.template.self);
      const changes = squashMapLevelModifiers(...allSelfModifiers);

      const didModifyVision = changes.adjustments.vision || changes.adjustments.detection;
      if (didModifyVision)
      {
        this.unit.fleet.visionIsDirty = true;
        // this.owner.updateVisibleStars(); done in onMapPresentModifierChange
      }

      onMapPresentModifierChange(changes, this.owner);
      onIncomeModifierChange(changes, this.owner);
      activeModuleData.mapLevelModifierAdjustments.onUnitModifierChange(this.unit, changes);
    };
  }

  public getSelfModifiers(): MapLevelModifier<UnitModifierAdjustments>
  {
    const activeModifiers = this.getAllActiveModifiers();

    const selfModifiers = activeModifiers.filter(modifier => modifier.template.self).map(modifier => modifier.template.self);
    const squashedSelfModifiers = squashMapLevelModifiers(getBaseUnitSelfModifier(), ...selfModifiers);

    return squashedSelfModifiers;
  }
  public getBattlePrepEffects(): AdjustmentsMap<UnitBattlePrepEffect>
  {
    return getBattlePrepEffectsFromModifiers(this, modifier => modifier.template.battlePrepEffects);
  }
  public handleConstruct(): void
  {
    const allModifiersFromPassiveSkills = this.unit.getAllPassiveSkills().map(passiveSkill =>
    {
      return passiveSkill.mapLevelModifiers;
    });
    const modifiersFromPassiveSkills = flatten2dArray(allModifiersFromPassiveSkills);
    this.addOriginatingModifiers(...modifiersFromPassiveSkills);

    // TODO 2019.11.01 | necessary?
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
    this.recheckAllModifiers();
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
      propagations.push(...toPropagate.propagations.localStar.map(modifierTemplate =>
      {
        return {
          template: modifierTemplate,
          target: this.unit.fleet.location.modifiers,
        };
      }));
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
          target: this.unit.fleet.player.modifiers,
        };
      }));
    }

    return propagations;
  }
}
