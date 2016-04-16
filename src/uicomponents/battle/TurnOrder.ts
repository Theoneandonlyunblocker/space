/// <reference path="../../../lib/react-global-0.13.3.d.ts" />

import Unit from "../../Unit";
import TurnOrderDisplayData from "../../TurnOrderDisplayData";

interface PropTypes extends React.Props<any>
{
  unitsBySide:
  {
    side1: Unit[];
    side2: Unit[];
  }
  turnOrderDisplayData: TurnOrderDisplayData[];
  hoveredUnit: Unit;
  onMouseLeaveUnit: (e: React.MouseEvent) => void;
  onMouseEnterUnit: (unit: Unit) => void;
}

interface StateType
{
  maxUnits?: number;
}

export class TurnOrderComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "TurnOrder";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialStateTODO();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.setMaxUnits = this.setMaxUnits.bind(this);    
  }
  
  private getInitialStateTODO(): StateType
  {
    return(
    {
      maxUnits: 7
    });
  }
  componentDidMount()
  {
    this.setMaxUnits();

    window.addEventListener("resize", this.setMaxUnits);
  }
  componentWillUnmount()
  {
    window.removeEventListener("resize", this.setMaxUnits);
  }

  setMaxUnits()
  {
    const minUnits = 7;

    const containerElement = React.findDOMNode(this);

    const containerWidth = containerElement.getBoundingClientRect().width - 30;
    const unitElementWidth = 160;

    const ceil = Math.ceil(containerWidth / unitElementWidth);

    this.setState(
    {
      maxUnits: Math.max(ceil, minUnits)
    });
  }

  render()
  {
    const hasGhost = this.props.turnOrderDisplayData.some(d => d.isGhost);
    const maxUnits = hasGhost ? this.state.maxUnits + 1 : this.state.maxUnits;
    const amountOfUnitsToDisplay = Math.min(maxUnits, this.props.turnOrderDisplayData.length);

    const toRender: React.HTMLElement[] = [];

    for (let i = 0; i < amountOfUnitsToDisplay; i++)
    {
      const displayData = this.props.turnOrderDisplayData[i];

      if (displayData.isGhost)
      {
        toRender.push(React.DOM.div(
        {
          className: "turn-order-arrow",
          key: "" + i
        }));
        continue;
      }

      const data: React.HTMLAttributes =
      {
        key: "" + i,
        className: "turn-order-unit",
        title: "delay: " + displayData.moveDelay + "\n",
        onMouseEnter: this.props.onMouseEnterUnit.bind(null, displayData.unit),
        onMouseLeave: this.props.onMouseLeaveUnit
      };

      if (this.props.unitsBySide.side1.indexOf(displayData.unit) > -1)
      {
        data.className += " turn-order-unit-friendly";
      }
      else
      {
        data.className += " turn-order-unit-enemy";
      }

      if (this.props.hoveredUnit && displayData.unit === this.props.hoveredUnit)
      {
        data.className += " turn-order-unit-hover";
      }

      toRender.push(
        React.DOM.div(data, displayData.unit.name)
      )

    }

    if (this.props.turnOrderDisplayData.length > maxUnits)
    {
      toRender.push(React.DOM.div(
      {
        className: "turn-order-more",
        key: "more"
      }, "..."));
    }

    return(
      React.DOM.div({className: "turn-order-container"},
        toRender
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(TurnOrderComponent);
export default Factory;
