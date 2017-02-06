/// <reference path="../../../lib/react-global.d.ts" />

import {Fleet} from "../../Fleet";
import FleetControls from "./FleetControls";


export interface PropTypes extends React.Props<any>
{
  isNotDetected: boolean;
  fleet: Fleet;
  hasMultipleSelected: boolean;
  isInspecting: boolean;
}

interface StateType
{
}

export class FleetInfoComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "FleetInfo";
  setFleetName(e: React.FormEvent)
  {
    var target = <HTMLInputElement> e.target;
    this.props.fleet.name.setName(target.value);
    this.forceUpdate();
  }

  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();
  }
  private bindMethods()
  {
    this.setFleetName = this.setFleetName.bind(this);
  }

  render()
  {
    const fleet = this.props.fleet;
    const isNotDetected = this.props.isNotDetected;
    if (!fleet)
    {
      return null;
    }

    const totalCurrentHealth = fleet.getTotalCurrentHealth();
    const totalMaxHealth = fleet.getTotalMaxHealth();

    const healthRatio = totalCurrentHealth / totalMaxHealth;
    const critThreshhold = 0.3;

    let healthStatus = "";

    if (!isNotDetected && healthRatio <= critThreshhold)
    {
      healthStatus += " critical";
    }
    else if (!isNotDetected && totalCurrentHealth < totalMaxHealth)
    {
      healthStatus += " wounded";
    }

    return(
      React.DOM.div(
      {
        className: "fleet-info" + (fleet.isStealthy ? " stealthy" : ""),
      },
        React.DOM.div(
        {
          className: "fleet-info-header",
        },
          React.DOM.input(
          {
            className: "fleet-info-name",
            value: isNotDetected ? "Unidentified fleet" : fleet.name.fullName,
            onChange: isNotDetected ? null : this.setFleetName,
            readOnly: isNotDetected,
          }),
          React.DOM.div(
          {
            className: "fleet-info-strength",
          },
            React.DOM.span(
            {
              className: "fleet-info-strength-current" + healthStatus,
            },
              isNotDetected ? "???" : totalCurrentHealth,
            ),
            React.DOM.span(
            {
              className: "fleet-info-strength-max",
            },
              isNotDetected ? "/???" : "/" + totalMaxHealth,
            ),
          ),
          FleetControls(
          {
            fleet: fleet,
            hasMultipleSelected: this.props.hasMultipleSelected,
            isInspecting: this.props.isInspecting,
          }),
        ),
        React.DOM.div(
        {
          className: "fleet-info-move-points",
        },
          isNotDetected ? "Moves: ?/?" : "Moves: " + fleet.getMinCurrentMovePoints() + "/" +
            fleet.getMinMaxMovePoints(),
        ),

      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(FleetInfoComponent);
export default Factory;
