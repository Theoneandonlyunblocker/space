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

  // TODO 2019.10.19 | not called anywhere
  public handleConstruct(): void
  {
    if (this.building.template.mapLevelModifier)
    {
      this.addOriginatingModifier(this.building.template.mapLevelModifier);

      this.propagateOriginatedModifiers();
    }
  }
  public handleUpgrade(): void
  {
    this.removeAllOriginatingModifiers();
    this.handleConstruct();
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
    const propagations: MapLevelModifiersPropagationWithoutId<BuildingModifier>[] = [];

    if (toPropagate.propagations && toPropagate.propagations.localStar)
    {
      propagations.push(
      {
        modifier: toPropagate.propagations.localStar,
        targetType: "localStar",
        target: this.building.location.modifiers,
      });
    }
    if (toPropagate.propagations && toPropagate.propagations.global)
    {
      propagations.push(
      {
        modifier: toPropagate.propagations.global,
        targetType: "global",
        target: app.game.globalModifiers,
      });
    }
    if (toPropagate.propagations && toPropagate.propagations.owningPlayer)
    {
      propagations.push(
      {
        modifier: toPropagate.propagations.owningPlayer,
        targetType: "owningPlayer",
        target: this.building.controller.modifiers,
      });
    }

    return propagations;
  }
}
