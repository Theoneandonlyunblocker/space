import * as React from "react";

import {Battle as BattleObj} from "core/src/battle/Battle";
import {Player} from "core/src/player/Player";
import { Battle, BattleComponent } from "./Battle";
import { MCTree } from "core/src/ai/MCTree";
import {options} from "core/src/app/Options";

// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  battle: BattleObj;
  humanPlayer: Player;
}

// TODO 2020.07.20 |
// battle ui component should have minimal hardcoded logic. logic should be supplied by props to allow reuse
// TODO 2020.07.20 |
// should allow switching to battle debug mode in battles during normal gameplay

const HumanVsAiBattleComponent: React.FunctionComponent<PropTypes> = props =>
{
  const mcTree = React.useRef<MCTree | null>(null);
  const battleComponent = React.useRef<BattleComponent>(null);

  return Battle(
  {
    ref: battleComponent,
    battle: props.battle,
    humanPlayer: props.humanPlayer,
    onAbilityUse: (ability, user, target, abilityUseWasByHuman) =>
    {
      if (abilityUseWasByHuman && mcTree.current)
      {
        mcTree.current.advanceMove(
        {
          ability: ability,
          userId: user.id,
          targetId: target.id,
        }, 0.25);
      }
    },
    handleAiTurn: () =>
    {
      if (!props.battle.activeUnit || props.battle.ended)
      {
        return;
      }

      if (!mcTree.current)
      {
        mcTree.current = new MCTree(props.battle, props.battle.activeUnit.battleStats.side);
      }

      const iterations = Math.max(
        options.debug.aiVsPlayerBattleSimulationDepth,
        mcTree.current.rootNode.getPossibleMoves(props.battle).length * Math.sqrt(options.debug.aiVsPlayerBattleSimulationDepth),
      );

      // TODO 2020.07.20 | no need to advance here. should do it in onAbilityUse() instead for cleanliness
      const move = mcTree.current.getBestMoveAndAdvance(iterations, 0.25);
      const target = props.battle.unitsById[move.targetId];

      battleComponent.current.handleAbilityUse(move.ability, target, false);
    },
  });
};

export const HumanVsAiBattle: React.FunctionComponentFactory<PropTypes> = React.createFactory(HumanVsAiBattleComponent);
