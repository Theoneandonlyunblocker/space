/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="fleetcontrols.ts"/>

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class FleetInfo extends React.Component<PropTypes, {}>
{
  displayName: string = "FleetInfo";
  setFleetName(e: Event)
  {
    var target = <HTMLInputElement> e.target;
    this.props.fleet.name = target.value;
    this.forceUpdate();
  }

  state:
  {
    
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
    var fleet: Fleet = this.props.fleet;
    if (!fleet) return null;
    var totalHealth = fleet.getTotalHealth();
    var isNotDetected: boolean = this.props.isNotDetected;

    var healthRatio = totalHealth.current / totalHealth.max;
    var critThreshhold = 0.3;

    var healthStatus = "";

    if (!isNotDetected && healthRatio <= critThreshhold)
    {
      healthStatus += " critical";
    }
    else if (!isNotDetected && totalHealth.current < totalHealth.max)
    {
      healthStatus += " wounded";
    }

    return(
      React.DOM.div(
      {
        className: "fleet-info" + (fleet.isStealthy ? " stealthy" : "")
      },
        React.DOM.div(
        {
          className: "fleet-info-header"
        },
          React.DOM.input(
          {
            className: "fleet-info-name",
            value: isNotDetected ? "Unidentified fleet" : fleet.name,
            onChange: isNotDetected ? null : this.setFleetName,
            readOnly: isNotDetected
          }),
          React.DOM.div(
          {
            className: "fleet-info-strength"
          }, 
            React.DOM.span(
            {
              className: "fleet-info-strength-current" + healthStatus
            },
              isNotDetected ? "???" : totalHealth.current
            ),
            React.DOM.span(
            {
              className: "fleet-info-strength-max"
            },
              isNotDetected ? "/???" : "/" + totalHealth.max
            )
          ),
          UIComponents.FleetControls(
          {
            fleet: fleet,
            hasMultipleSelected: this.props.hasMultipleSelected,
            isInspecting: this.props.isInspecting
          })
        ),
        React.DOM.div(
        {
          className: "fleet-info-move-points"
        },
          isNotDetected ? "Moves: ?/?" : "Moves: " + fleet.getMinCurrentMovePoints() + "/" +
            fleet.getMinMaxMovePoints()
        )
        
      )
    );
  }
}
