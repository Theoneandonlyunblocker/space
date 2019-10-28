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
    if (this.building.template.mapLevelModifier)
    {
      this.addOriginatingModifier(this.building.template.mapLevelModifier);
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
      propagations.push(
      {
        template: toPropagate.propagations.localStar,
        target: this.building.location.modifiers,
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
        target: this.building.controller.modifiers,
      });
    }

    return propagations;
  }
}
