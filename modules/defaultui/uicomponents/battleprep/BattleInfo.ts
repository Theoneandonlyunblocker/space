import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {PlayerFlag} from "../PlayerFlag";
import {TerritoryBuildingList} from "../galaxymap/TerritoryBuildingList";

import {BattlePrep} from "src/battleprep/BattlePrep";

import {localize} from "../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  battlePrep: BattlePrep;
}

interface StateType
{
}

export class BattleInfoComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "BattleInfo";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    const battlePrep = this.props.battlePrep;
    const star = battlePrep.battleData.location;
    const isAttacker = battlePrep.humanPlayer === battlePrep.attacker;

    return(
      ReactDOMElements.div(
      {
        className: "battle-info",
      },
        ReactDOMElements.div(
        {
          className: "battle-info-opponent",
        },
          PlayerFlag(
          {
            flag: battlePrep.enemyPlayer.flag,
            props:
            {
              className: "battle-info-opponent-icon",
            },
          }),
          ReactDOMElements.div(
          {
            className: "battle-info-opponent-name",
          },
            battlePrep.enemyPlayer.name.baseName,
          ),
        ),
        ReactDOMElements.div(
        {
          className: "battle-info-summary",
        },
          `${star.name}: ${isAttacker ? localize("attacking") : localize("defending")}`
        ),
        TerritoryBuildingList(
        {
          buildings: star.territoryBuildings,
          reverse: isAttacker,
        }),
      )
    );
  }
}

export const BattleInfo: React.Factory<PropTypes> = React.createFactory(BattleInfoComponent);
