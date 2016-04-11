/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes extends React.Props<any>
{
  endTurn: any; // TODO refactor | define prop type 123
  strength: any; // TODO refactor | define prop type 123
  handleClick: any; // TODO refactor | define prop type 123
  activeColumns: any; // TODO refactor | define prop type 123
}

interface StateType
{
}

class AttitudeModifierInfo_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "AttitudeModifierInfo";

  makeCell(type: string)
  {
    var cellProps: any = {};
    cellProps.key = type;
    cellProps.className = "attitude-modifier-info-cell" +
      " attitude-modifier-info-" + type;

    var cellContent: any;

    switch (type)
    {
      case "endTurn":
      {
        if (this.props.endTurn < 0)
        {
          cellContent = null;
          return;
        }
      }
      case "strength":
      {
        var relativeValue = getRelativeValue(this.props.strength, -20, 20);
        relativeValue = clamp(relativeValue, 0, 1);

        var deviation = Math.abs(0.5 - relativeValue) * 2;

        var hue = 110 * relativeValue;
        var saturation = 0 + 50 * deviation;
        if (deviation > 0.3) saturation += 40;
        var lightness = 70 - 20 * deviation;

        cellProps.style =
        {
          color: "hsl(" +
            hue + "," +
            saturation + "%," +
            lightness + "%)"
        }
      }
      default:
      {
        cellContent = this.props[type];

        if (isFinite(cellContent))
        {
          cellProps.className += " center-text"
        }

        break;
      }
    }

    return(
      React.DOM.td(cellProps, cellContent)
    );
  }

  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.makeCell = this.makeCell.bind(this);    
  }
  
  render()
  {
    var columns = this.props.activeColumns;

    var cells: any = [];

    for (var i = 0; i < columns.length; i++)
    {
      var cell = this.makeCell(columns[i].key);

      cells.push(cell);
    }

    var rowProps: any =
    {
      className: "diplomatic-status-player",
      onClick : this.props.handleClick
    };

    return(
      React.DOM.tr(rowProps,
        cells
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(AttitudeModifierInfo_COMPONENT_TODO);
export default Factory;
