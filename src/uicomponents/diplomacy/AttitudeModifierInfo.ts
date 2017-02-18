/// <reference path="../../../lib/react-global.d.ts" />

import ListItemProps from "../list/ListItemProps";

import
{
  clamp,
  getRelativeValue,
} from "../../utility";

export interface PropTypes extends ListItemProps, React.Props<any>
{
  name: string;
  endTurn: number;
  strength: number;

  alwaysShowAtTopOfList?: boolean;
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
    const cellProps:
    {
      key?: string;
      className?: string;
      style?:
      {
        color: string;
      }
    } =
    {
      key: type,
      className: "attitude-modifier-info-cell" + " attitude-modifier-info-" + type,
    };

    let cellContent: string | number;

    switch (type)
    {
      case "name":
      {
        cellContent = this.props.name;
        break;
      }
      case "endTurn":
      {
        if (this.props.endTurn < 0)
        {
          cellContent = null;
        }
        break;
      }
      case "strength":
      {
        let relativeValue = getRelativeValue(this.props.strength, -20, 20);
        relativeValue = clamp(relativeValue, 0, 1);

        const deviation = Math.abs(0.5 - relativeValue) * 2;

        const hue = 110 * relativeValue;
        let saturation = 0 + 50 * deviation;
        if (deviation > 0.3) saturation += 40;
        const lightness = 70 - 20 * deviation;

        cellProps.style =
        {
          color: "hsl(" +
            hue + "," +
            saturation + "%," +
            lightness + "%)",
        };
        cellContent = this.props.strength;
        break;
      }
    }

    return(
      React.DOM.td(cellProps, cellContent)
    );
  }

  render()
  {
    const columns = this.props.activeColumns;

    const cells: React.ReactHTMLElement<any>[] = [];

    for (let i = 0; i < columns.length; i++)
    {
      const cell = this.makeCell(columns[i].key);

      cells.push(cell);
    }

    return(
      React.DOM.tr(
      {
        className: "attitude-modifier-info",
        onClick : this.props.handleClick,
      },
        cells,
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(AttitudeModifierInfoComponent);
export default Factory;
