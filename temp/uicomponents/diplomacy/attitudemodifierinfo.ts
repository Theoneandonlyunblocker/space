/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes
{
  // TODO refactor | add prop types
}

interface StateType
{
  // TODO refactor | add state type
}

export default class AttitudeModifierInfo extends React.Component<PropTypes, {}>
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

  state:
  {
    
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
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
