/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes extends React.Props<any>
{
  // TODO refactor | add prop types
}

interface StateType
{
  // TODO refactor | add state type
}

class TurnOrder_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "TurnOrder";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  private getInitialState(): StateType
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
    var minUnits = 7;

    var containerElement = React.findDOMNode(this);

    var containerWidth = containerElement.getBoundingClientRect().width;
    containerWidth -= 30;
    var unitElementWidth = 160;

    var ceil = Math.ceil(containerWidth / unitElementWidth);

    this.setState(
    {
      maxUnits: Math.max(ceil, minUnits)
    });
  }

  render()
  {
    var maxUnits = this.state.maxUnits;
    var turnOrder = this.props.turnOrder.slice(0);

    if (this.props.potentialDelay)
    {
      var fake =
      {
        isFake: true,
        id: this.props.potentialDelay.id,
        battleStats:
        {
          moveDelay: this.props.potentialDelay.delay
        }
      };

      turnOrder.push(fake);

      // TODO
      // turnOrder.sort(turnOrderSortFunction);
    }

    var maxUnitsWithFake = maxUnits;

    if (fake && turnOrder.indexOf(fake) <= maxUnits)
    {
      maxUnitsWithFake++;
    }

    turnOrder = turnOrder.slice(0, maxUnitsWithFake);

    var toRender: ReactDOMPlaceHolder[] = [];

    for (var i = 0; i < turnOrder.length; i++)
    {
      var unit = turnOrder[i];

      if (unit.isFake)
      {
        toRender.push(React.DOM.div(
        {
          className: "turn-order-arrow",
          key: "" + i
        }));
        continue;
      }

      var data =
      {
        key: "" + i,
        className: "turn-order-unit",
        title: "delay: " + unit.battleStats.moveDelay + "\n" +
          "speed: " + unit.attributes.speed,
        onMouseEnter: this.props.onMouseEnterUnit.bind(null, unit),
        onMouseLeave: this.props.onMouseLeaveUnit
      };

      if (this.props.unitsBySide.side1.indexOf(unit) > -1)
      {
        data.className += " turn-order-unit-friendly";
      }
      else if (this.props.unitsBySide.side2.indexOf(unit) > -1)
      {
        data.className += " turn-order-unit-enemy";
      }

      if (this.props.hoveredUnit && unit.id === this.props.hoveredUnit.id)
      {
        data.className += " turn-order-unit-hover";
      }

      toRender.push(
        React.DOM.div(data, unit.name)
      )

    }

    if (this.props.turnOrder.length > maxUnits)
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

const Factory: React.Factory<PropTypes> = React.createFactory(TurnOrder_COMPONENT_TODO);
export default Factory;
