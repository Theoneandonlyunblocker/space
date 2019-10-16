import { MapLevelModifiersCollection } from "./MapLevelModifiersCollection";
import { Building } from "../building/Building";
import { app } from "../app/App";
import { MapLevelModifiersPropagationWithoutId } from "./ModifierPropagation";
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
    if (this.building.template.mapLevelModifier)
    {
      this.addOriginatingModifier(this.building.template.mapLevelModifier);
    }
  }
  public handleOwnerChange(): void
  {
    this.depropagateOriginatedModifiers();
    this.propagateOriginatedModifiers();
  }
  public handleDestroy(): void
  {
    this.removeAllModifiers();
  }


  protected modifierPassesFilter(modifier: BuildingModifier): boolean
  {
    return true;
  }
  protected getPropagationsFor(toPropagate: BuildingModifier)
  {
    const propagations: MapLevelModifiersPropagationWithoutId<BuildingModifier, any>[] = [];

    if (toPropagate.localStar)
    {
      propagations.push(
      {
        modifier: toPropagate.localStar,
        targetType: "localStar",
        target: this.building.location.modifiers,
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
        target: this.building.controller.modifiers,
      });
    }

    return propagations;
  }
}
