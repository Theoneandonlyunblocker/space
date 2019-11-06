import { MapLevelModifiersCollection } from "./MapLevelModifiersCollection";
import { Star } from "../map/Star";
import { squashMapLevelModifiers, MapLevelModifier } from "./MapLevelModifiers";
import { app } from "../app/App";
import { SimpleMapLevelModifiersPropagation } from "./ModifierPropagation";
import { StarModifier, StarModifierAdjustments, getBaseStarSelfModifier } from "./StarModifier";
import { Player } from "../player/Player";
import { activeModuleData } from "../app/activeModuleData";
import { onMapPresentModifierChange, onIncomeModifierChange } from "./onModifierChangeTriggers";


export class StarModifiersCollection extends MapLevelModifiersCollection<StarModifier>
{
  private star: Star;
  private get owner(): Player
  {
    return this.star.owner;
  }

  constructor(star: Star)
  {
    super();

    this.star = star;
    this.onChange = changedModifiers =>
    {
      const allSelfModifiers = changedModifiers.filter(modifier => modifier.template.self).map(modifier => modifier.template.self);
      const changes = squashMapLevelModifiers(...allSelfModifiers);

      onMapPresentModifierChange(changes, this.owner);
      onIncomeModifierChange(changes, this.owner);
      if (changes.adjustments.mining)
      {
        // has already triggered income updates if changes.income is present
        if (!changes.income)
        {
          activeModuleData.scripts.call("onPlayerIncomeChange", this.owner);
        }
      }
      activeModuleData.mapLevelModifierAdjustments.onStarModifierChange(this.star, changes);
    };
  }

  public getSelfModifiers(): MapLevelModifier<StarModifierAdjustments>
  {
    const activeModifiers = this.getAllActiveModifiers();

    const selfModifiers = activeModifiers.filter(modifier => modifier.template.self).map(modifiers => modifiers.template.self);
    const squashedSelfModifiers = squashMapLevelModifiers(getBaseStarSelfModifier(), ...selfModifiers);

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
