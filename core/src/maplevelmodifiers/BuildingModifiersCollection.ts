import { MapLevelModifiersCollection } from "./MapLevelModifiersCollection";
import { Building } from "../building/Building";
import { app } from "../app/App";
import { MapLevelModifiersPropagationWithoutId } from "./ModifierPropagation";
import { BuildingModifiers } from "./BuildingModifiers";


export class BuildingModifiersCollection extends MapLevelModifiersCollection<BuildingModifiers>
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
      this.addOriginatingModifier(this.building.template.mapLevelModifiers);
    }
  }
  public handleUpgrade(): void
  {
    this.removeAllOriginatingModifiers();
    if (this.building.template.mapLevelModifiers)
    {
      this.addOriginatingModifier(this.building.template.mapLevelModifiers);
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


  protected modifierPassesFilter(modifier: BuildingModifiers): boolean
  {
    return true;
  }
  protected getPropagationsFor(toPropagate: BuildingModifiers)
  {
    const propagations: MapLevelModifiersPropagationWithoutId<BuildingModifiers, any>[] = [];

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
