import { MapLevelModifiersCollection } from "./MapLevelModifiersCollection";
import { Building } from "../building/Building";
import { app } from "../app/App";
import { SimpleMapLevelModifiersPropagation } from "./ModifierPropagation";
import { BuildingModifier } from "./BuildingModifier";


export class BuildingModifiersCollection extends MapLevelModifiersCollection<BuildingModifier>
{
  private building: Building;

  constructor(building: Building)
  {
    super();

    this.building = building;
  }

  public handleConstruct(): void
  {
    if (this.building.template.mapLevelModifiers)
    {
      this.addOriginatingModifiers(...this.building.template.mapLevelModifiers);
    }
  }
  public handleUpgrade(): void
  {
    this.removeAllOriginatingModifiers();
    this.handleConstruct();
  }
  public handleOwnerChange(): void
  {
    this.recheckAllModifiers();
  }
  public handleDestroy(): void
  {
    this.removeAllModifiers();
  }


  protected templateShouldBeActive(modifier: BuildingModifier): boolean
  {
    return true;
  }
  protected getPropagationsForTemplate(toPropagate: BuildingModifier)
  {
    const propagations: SimpleMapLevelModifiersPropagation<BuildingModifier>[] = [];

    if (toPropagate.propagations && toPropagate.propagations.localStar)
    {
      propagations.push(...toPropagate.propagations.localStar.map(modifierTemplate =>
      {
        return {
          template: modifierTemplate,
          target: this.building.location.modifiers,
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
          target: this.building.controller.modifiers,
        };
      }));
    }

    return propagations;
  }
}
