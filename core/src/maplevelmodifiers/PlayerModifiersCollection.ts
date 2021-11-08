import { MapLevelModifiersCollection } from "./MapLevelModifiersCollection";
import { Player } from "../player/Player";
import { SimpleMapLevelModifiersPropagation } from "./ModifierPropagation";
import { PlayerModifier, PlayerModifierAdjustments, getBasePlayerSelfModifier } from "./PlayerModifier";
import { squashMapLevelModifiers, MapLevelModifier } from "./MapLevelModifiers";
import { onIncomeModifierChange } from "./onModifierChangeTriggers";
import { activeModuleData } from "../app/activeModuleData";


export class PlayerModifiersCollection extends MapLevelModifiersCollection<PlayerModifier>
{
  private player: Player;

  constructor(player: Player)
  {
    super();

    this.player = player;
    this.onChange = changedModifiers =>
    {
      const allSelfModifiers = changedModifiers.filter(modifier => modifier.template.self).map(modifier => modifier.template.self);
      const changes = squashMapLevelModifiers(...allSelfModifiers);

      onIncomeModifierChange(changes, this.player);
      activeModuleData.mapLevelModifierAdjustments.onPlayerModifierChange(this.player, changes);
    };
  }

  public getSelfModifiers(): MapLevelModifier<PlayerModifierAdjustments>
  {
    const activeModifiers = this.getAllActiveModifiers();

    const selfModifiers = activeModifiers.filter(modifier => modifier.template.self).map(modifiers => modifiers.template.self);
    const squashedSelfModifiers = squashMapLevelModifiers(getBasePlayerSelfModifier(), ...selfModifiers);

    return squashedSelfModifiers;
  }

  protected templateShouldBeActive(modifier: PlayerModifier): boolean
  {
    return !modifier.filter || modifier.filter(this.player);
  }
  protected getPropagationsForTemplate(toPropagate: PlayerModifier)
  {
    const propagations: SimpleMapLevelModifiersPropagation<PlayerModifier>[] = [];

    if (toPropagate.propagations && toPropagate.propagations.ownedStars)
    {
      this.player.controlledLocations.forEach(location =>
      {
        propagations.push(...toPropagate.propagations.ownedStars.map(modifierTemplate =>
        {
          return {
            template: modifierTemplate,
            target: location.modifiers,
          };
        }));
      });
    }
    if (toPropagate.propagations && toPropagate.propagations.ownedUnits)
    {
      this.player.units.forEach(unit =>
      {
        propagations.push(...toPropagate.propagations.ownedUnits.map(modifierTemplate =>
        {
          return {
            template: modifierTemplate,
            target: unit.mapLevelModifiers,
          };
        }));
      });
    }

    return propagations;
  }
}
