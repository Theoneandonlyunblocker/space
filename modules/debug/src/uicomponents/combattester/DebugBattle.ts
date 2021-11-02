import * as React from "react";

import { Battle as BattleObj } from "core/src/battle/Battle";
import { Battle } from "modules/defaultui/src/uicomponents/battle/Battle";
import { Unit } from "core/src/unit/Unit";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  battle: BattleObj;
  onClickUnit: (unit: Unit) => void;
}

const DebugBattleComponent: React.FunctionComponent<PropTypes> = props =>
{
  return(
    Battle(
    {
      battle: props.battle,
      // TODO 2021.11.02 |
      humanPlayer: null,
      onAbilityUse: (ability, user, target, abilityUseWasByHuman) =>
      {

      },
      handleAiTurn: () =>
      {

      },
    })
  );
};

export const DebugBattle: React.FunctionComponentFactory<PropTypes> = React.createFactory(DebugBattleComponent);
