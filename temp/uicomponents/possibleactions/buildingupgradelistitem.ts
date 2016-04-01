/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../../player.ts" />
/// <reference path="../mixins/updatewhenmoneychanges.ts" />

export interface PropTypes
{
  player: Player;
  handleUpgrade: reactTypeTODO_func;
  upgradeData: reactTypeTODO_object;
}

export default class BuildingUpgradeListItem extends React.Component<PropTypes, {}>
{
  displayName: string = "BuildingUpgradeListItem";
  mixins: reactTypeTODO_any = [UpdateWhenMoneyChanges];

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  getInitialState()
  {
    return(
    {
      canAfford: this.props.player.money >= this.props.upgradeData.cost
    });
  }
  
  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  overrideHandleMoneyChange()
  {
    this.setState(
    {
      canAfford: this.props.player.money >= this.props.upgradeData.cost
    })
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  handleClick()
  {
    this.props.handleUpgrade(this.props.upgradeData);
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  render()
  {
    var upgradeData: IBuildingUpgradeData = this.props.upgradeData;

    var rowProps: any =
    {
      key: upgradeData.template.type,
      className: "building-upgrade-list-item",
      onClick: this.handleClick,
      title: upgradeData.template.description
    };

    var costProps: any = 
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
