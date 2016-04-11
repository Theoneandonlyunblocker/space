/// <reference path="../../../lib/react-0.13.3.d.ts" />

import app from "../../../src/App.ts"; // TODO refactor | autogenerated
import * as React from "react";

/// <reference path="../../star.ts" />


import Player from "../../../src/Player.ts";
import Star from "../../../src/Star.ts";


export interface PropTypes extends React.Props<any>
{
  star: Star;
  player: Player;
  triggerUpdate: reactTypeTODO_func;
  money: number;
}

interface StateType
{
  canAfford?: any; // TODO refactor | define state type 456
}

class ConstructManufactory_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "ConstructManufactory";
  mixins: reactTypeTODO_any = [React.addons.PureRenderMixin];


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleConstruct = this.handleConstruct.bind(this);    
  }
  
  private getInitialState(): StateType
  {
    return(
    {
      canAfford: this.props.money >= app.moduleData.ruleSet.manufactory.buildCost
    });
  }
  
  componentWillReceiveProps(newProps: any)
  {
    this.setState(
    {
      canAfford: newProps.money >= app.moduleData.ruleSet.manufactory.buildCost
    });
  }

  handleConstruct()
  {
    var star: Star = this.props.star;
    var player: Player = this.props.player;
    star.buildManufactory();
    player.money -= app.moduleData.ruleSet.manufactory.buildCost;
    this.props.triggerUpdate();
  }

  render()
  {
    return(
      React.DOM.div(
      {
        className: "construct-manufactory-container"
      },
        React.DOM.button(
        {
          className: "construct-manufactory-button" + (this.state.canAfford ? "" : " disabled"),
          onClick: this.state.canAfford ? this.handleConstruct : null,
          disabled: !this.state.canAfford
        },
          React.DOM.span(
          {
            className: "construct-manufactory-action"
          },
            "Construct manufactory"
          ),
          React.DOM.span(
          {
            className: "construct-manufactory-cost money-style" +
              (this.state.canAfford ? "" : " negative")
          },
            app.moduleData.ruleSet.manufactory.buildCost
          )
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(ConstructManufactory_COMPONENT_TODO);
export default Factory;
