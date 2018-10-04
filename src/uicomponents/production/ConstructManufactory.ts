import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import Player from "../../Player";
import Star from "../../Star";
import {activeModuleData} from "../../activeModuleData";

import {localize} from "../../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  star: Star;
  player: Player;
  triggerUpdate: () => void;
  money: number;
}

interface StateType
{
  canAfford: boolean;
}

export class ConstructManufactoryComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName = "ConstructManufactory";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleConstruct = this.handleConstruct.bind(this);
  }

  private getInitialStateTODO(): StateType
  {
    return(
    {
      canAfford: this.props.money >= activeModuleData.ruleSet.manufactory.buildCost,
    });
  }

  componentWillReceiveProps(newProps: PropTypes)
  {
    this.setState(
    {
      canAfford: newProps.money >= activeModuleData.ruleSet.manufactory.buildCost,
    });
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
    return(
      ReactDOMElements.div(
      {
        className: "construct-manufactory-container",
      },
        ReactDOMElements.button(
        {
          className: "construct-manufactory-button" + (this.state.canAfford ? "" : " disabled"),
          onClick: this.state.canAfford ? this.handleConstruct : null,
          disabled: !this.state.canAfford,
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
              (this.state.canAfford ? "" : " negative"),
          },
            activeModuleData.ruleSet.manufactory.buildCost,
          ),
        ),
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(ConstructManufactoryComponent);
export default factory;
