/// <reference path="../../../lib/react-global.d.ts" />

import app from "../../App";
import Player from "../../Player";
import Star from "../../Star";


export interface PropTypes extends React.Props<any>
{
  star: Star;
  player: Player;
  triggerUpdate: () => void;
  money: number;
}

interface StateType
{
  canAfford?: boolean;
}

export class ConstructManufactoryComponent extends React.PureComponent<PropTypes, StateType>
{
  displayName: string = "ConstructManufactory";
  state: StateType;

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
      React.DOM.div(
      {
        className: "construct-manufactory-container",
      },
        React.DOM.button(
        {
          className: "construct-manufactory-button" + (this.state.canAfford ? "" : " disabled"),
          onClick: this.state.canAfford ? this.handleConstruct : null,
          disabled: !this.state.canAfford,
        },
          React.DOM.span(
          {
            className: "construct-manufactory-action",
          },
            "Construct manufactory",
          ),
          React.DOM.span(
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

const Factory: React.Factory<PropTypes> = React.createFactory(ConstructManufactoryComponent);
export default Factory;
