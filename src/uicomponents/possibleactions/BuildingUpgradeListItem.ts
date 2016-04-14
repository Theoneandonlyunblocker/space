/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

import BuildingUpgradeData from "../../BuildingUpgradeData";
import Player from "../../Player";


interface PropTypes extends React.Props<any>
{
  player: Player;
  handleUpgrade: (upgradeData: BuildingUpgradeData) => void;
  upgradeData: BuildingUpgradeData
}

interface StateType
{
  canAfford?: boolean;
}

export class BuildingUpgradeListItemComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "BuildingUpgradeListItem";
  // mixins = [UpdateWhenMoneyChanges];

  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleClick = this.handleClick.bind(this);
    this.overrideHandleMoneyChange = this.overrideHandleMoneyChange.bind(this);    
  }
  
  private getInitialState(): StateType
  {
    return(
    {
      canAfford: this.props.player.money >= this.props.upgradeData.cost
    });
  }
  
  overrideHandleMoneyChange()
  {
    this.setState(
    {
      canAfford: this.props.player.money >= this.props.upgradeData.cost
    })
  }

  handleClick()
  {
    this.props.handleUpgrade(this.props.upgradeData);
  }

  render()
  {
    var upgradeData = this.props.upgradeData;

    var rowProps: React.HTMLAttributes =
    {
      key: upgradeData.template.type,
      className: "building-upgrade-list-item",
      onClick: this.handleClick,
      title: upgradeData.template.description
    };

    var costProps: React.HTMLAttributes = 
    {
      key: "cost",
      className: "building-upgrade-list-item-cost"
    };

    if (!this.state.canAfford)
    {
      rowProps.onClick = null;
      rowProps.disabled = true;
      rowProps.className += " disabled";

      costProps.className += " negative";
    }

    return(
      React.DOM.tr(rowProps,
        React.DOM.td(
        {
          key: "name",
          className: "building-upgrade-list-item-name"
        }, upgradeData.template.displayName + " " + (upgradeData.level > 1 ? upgradeData.level : "")),
        React.DOM.td(costProps, upgradeData.cost)
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(BuildingUpgradeListItemComponent);
export default Factory;
