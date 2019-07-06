import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Player} from "../../../../src/Player";
import {Star} from "../../../../src/Star";
import {activeModuleData} from "../../../../src/activeModuleData";

import {localize} from "../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  star: Star;
  player: Player;
  triggerUpdate: () => void;
  money: number;
}

interface StateType
{
}

export class ConstructManufactoryComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName = "ConstructManufactory";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = {};

    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleConstruct = this.handleConstruct.bind(this);
  }

  handleConstruct()
  {
    const star = this.props.star;
    const player = this.props.player;
    star.buildManufactory();
    player.money -= activeModuleData.ruleSet.manufactory.buildCost;
    this.props.triggerUpdate();
  }

  render()
  {
    const canAfford = this.props.money >= activeModuleData.ruleSet.manufactory.buildCost;

    return(
      ReactDOMElements.div(
      {
        className: "construct-manufactory-container",
      },
        ReactDOMElements.button(
        {
          className: "construct-manufactory-button" + (canAfford ? "" : " disabled"),
          onClick: canAfford ? this.handleConstruct : null,
          disabled: !canAfford,
        },
          ReactDOMElements.span(
          {
            className: "construct-manufactory-action",
          },
            localize("constructManufactory")(),
          ),
          ReactDOMElements.span(
          {
            className: "construct-manufactory-cost money-style" +
              (canAfford ? "" : " negative"),
          },
            activeModuleData.ruleSet.manufactory.buildCost,
          ),
        ),
      )
    );
  }
}

export const ConstructManufactory: React.Factory<PropTypes> = React.createFactory(ConstructManufactoryComponent);
