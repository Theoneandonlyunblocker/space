/// <reference path="../../../lib/react-global.d.ts" />

import ListColumn from "../unitlist/ListColumn";
import Player from "../../Player";
import BuildingTemplate from "../../templateinterfaces/BuildingTemplate";

import UpdateWhenMoneyChanges from "../mixins/UpdateWhenMoneyChanges";
import applyMixins from "../mixins/applyMixins";

interface PropTypes extends React.Props<any>
{
  activeColumns: ListColumn[];
  template: BuildingTemplate;
  player: Player;
  buildCost: number;
  handleClick: () => void;
  typeName: string;
}

interface StateType
{
  canAfford?: boolean;
}

export class BuildableBuildingComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "BuildableBuilding";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialStateTODO();
    
    this.bindMethods();
    applyMixins(this, new UpdateWhenMoneyChanges(this, this.overrideHandleMoneyChange));
  }
  private bindMethods()
  {
    this.overrideHandleMoneyChange = this.overrideHandleMoneyChange.bind(this);
    this.makeCell = this.makeCell.bind(this);    
  }
  
  private getInitialStateTODO(): StateType
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
    var cellProps: React.HTMLAttributes = {};
    cellProps.key = type;
    cellProps.className = "buildable-building-list-item-cell " + type;

    var cellContent: string | number;

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

    for (let i = 0; i < columns.length; i++)
    {
      cells.push(
        this.makeCell(columns[i].key)
      );
    }

    var props: React.HTMLAttributes =
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
