/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes
{
  guardAmount?: number;
  guardCoverage?: number; // GuardCoverage enum

  isPreparing?: boolean;
}

export default class UnitStatus extends React.Component<PropTypes, {}>
{
  displayName: string = "UnitStatus";


  state:
  {
    
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  render()
  {
    var statusElement: ReactDOMPlaceHolder = null;

    if (this.props.guardAmount > 0)
    {
      var guard = this.props.guardAmount;
      var damageReduction = Math.min(50, guard / 2);
      var guardText = "" + guard + "% chance to protect ";
      guardText += (this.props.guardCoverage === GuardCoverage.all ? "all units." : " units in same row.");
      guardText += "\n" + "This unit takes " + damageReduction + "% reduced damage from physical attacks."
      statusElement = React.DOM.div(
      {
        className: "status-container guard-meter-container"
      },
        React.DOM.div(
        {
          className: "guard-meter-value",
          style:
          {
            width: "" + clamp(guard, 0, 100) + "%"
          }
        }),
        React.DOM.div(
        {
          className: "status-inner-wrapper"
        },
          React.DOM.div(
          {
            className: "guard-text-container status-inner",
            title: guardText
          },
            React.DOM.div(
            {
              className: "guard-text status-text"
            }, "Guard"),
            React.DOM.div(
            {
              className: "guard-text-value status-text"
            }, "" + guard + "%")
          )
        )
      );
    }
    else if (this.props.isPreparing)
    {
      statusElement = React.DOM.div(
      {
        className: "status-container preparation-container"
      },
        React.DOM.div(
        {
          className: "status-inner-wrapper"
        },
          React.DOM.div(
          {
            className: "preparation-text-container status-inner",
            title: "Unit is preparing to use ability"
          },
            "Preparing"
          )
        )
      );
    }

    return(
      React.DOM.div({className: "unit-status"},
        statusElement
      )
    );
  }
}
