/// <reference path="../../../lib/react-global.d.ts" />

import ListColumn from "../unitlist/ListColumn";
import ListItem from "../unitlist/ListItem";

import
{
  clamp,
  getRelativeValue,
} from "../../utility";

interface PropTypes extends React.Props<any>
{
  endTurn: number;
  strength: number;
  handleClick: () => void;
  activeColumns: ListColumn[];
}

interface StateType
{
}

export class AttitudeModifierInfoComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "AttitudeModifierInfo";
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
  
  makeCell(type: string)
  {
    var cellProps:
    {
      key?: string;
      className?: string;
      style?:
      {
        color: string;
      }
    } = {};
    cellProps.key = type;
    cellProps.className = "attitude-modifier-info-cell" +
      " attitude-modifier-info-" + type;

    var cellContent: string | number;

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

        if (isFinite(<number>cellContent))
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
  
  render()
  {
    var columns = this.props.activeColumns;

    var cells: React.ReactHTMLElement<any>[] = [];

    for (let i = 0; i < columns.length; i++)
    {
      var cell = this.makeCell(columns[i].key);

      cells.push(cell);
    }

    return(
      React.DOM.tr(
      {
      className: "diplomatic-status-player",
      onClick : this.props.handleClick
      },
        cells
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(AttitudeModifierInfoComponent);
export default Factory;
