/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../mixins/updatewhenmoneychanges.ts" />

/// <reference path="../../player.ts" />


import Player from "../../Player.ts";
import BuildingTemplate from "../../templateinterfaces/BuildingTemplate.d.ts";


interface PropTypes extends React.Props<any>
{
  activeColumns: ListColumn[];
  template: reactTypeTODO_object;
  player: Player;
  buildCost: number;
  handleClick: reactTypeTODO_func;
}

interface StateType
{
  canAfford?: boolean;
}

export class BuildableBuildingComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "BuildableBuilding";
  mixins: reactTypeTODO_any = [UpdateWhenMoneyChanges];


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.overrideHandleMoneyChange = this.overrideHandleMoneyChange.bind(this);
    this.makeCell = this.makeCell.bind(this);    
  }
  
  private getInitialState(): StateType
  {
    return(
    {
      canAfford: this.props.player.money >= this.props.buildCost
    });
  }
  
  overrideHandleMoneyChange()
  {
    this.setState(
    {
      canAfford: this.props.player.money >= this.props.buildCost
    });
  }

  makeCell(type: string)
  {
    var cellProps: any = {};
    cellProps.key = type;
    cellProps.className = "buildable-building-list-item-cell " + type;

    var cellContent: any;

    switch (type)
    {
      case ("buildCost"):
      {
        if (!this.state.canAfford)
        {
          cellProps.className += " negative";
        }
      }
      default:
      {
        cellContent = this.props[type];

        break;
      }
    }

    return(
      React.DOM.td(cellProps, cellContent)
    );
  }

  render()
  {
    var template = this.props.template;
    var cells: React.HTMLElement[] = [];
    var columns = this.props.activeColumns;

    for (var i = 0; i < columns.length; i++)
    {
      cells.push(
        this.makeCell(columns[i].key)
      );
    }

    var props: any =
    {
      className: "buildable-item buildable-building",
      onClick: this.props.handleClick,
      title: template.description
    }
    if (!this.state.canAfford)
    {
      props.onClick = null;
      props.disabled = true;
      props.className += " disabled";
    }

    return(
      React.DOM.tr(props,
      cells
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(BuildableBuildingComponent);
export default Factory;
