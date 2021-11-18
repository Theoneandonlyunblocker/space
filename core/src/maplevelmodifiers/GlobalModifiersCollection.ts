import { MapLevelModifiersCollection } from "./MapLevelModifiersCollection";
import { Game } from "../game/Game";
import { SimpleMapLevelModifiersPropagation } from "./ModifierPropagation";
import { GlobalModifier } from "./GlobalModifier";


export class GlobalModifiersCollection extends MapLevelModifiersCollection<GlobalModifier>
{
  private game: Game;

  constructor(game: Game)
  {
    super();

    this.game = game;
  }

  protected templateShouldBeActive(modifier: GlobalModifier): boolean
  {
    return true;
  }
  protected getPropagationsForTemplate(toPropagate: GlobalModifier)
  {
    const propagations: SimpleMapLevelModifiersPropagation<GlobalModifier>[] = [];

    if (toPropagate.propagations?.stars)
    {
      this.game.galaxyMap.stars.forEach(location =>
      {
        propagations.push(...toPropagate.propagations.stars.map(modifierTemplate =>
        {
          return {
            template: modifierTemplate,
            target: location.modifiers,
          };
        }));
      });
    }
    if (toPropagate.propagations?.units)
    {
      this.game.getAllUnits().forEach(unit =>
      {
        propagations.push(...toPropagate.propagations.units.map(modifierTemplate =>
        {
          return {
            template: modifierTemplate,
            target: unit.mapLevelModifiers,
          };
        }));
      });
    }
    if (toPropagate.propagations?.players)
    {
      this.game.getLiveMajorPlayers().forEach(player =>
      {
        propagations.push(...toPropagate.propagations.players.map(modifierTemplate =>
        {
          return {
            template: modifierTemplate,
            target: player.modifiers,
          };
        }));
      });
    }

    return propagations;
  }
}
