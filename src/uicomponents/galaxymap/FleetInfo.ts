import * as React from "react";

import {localize} from "../../../localization/localize";
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
  public displayName = "FleetInfo";
  setFleetName(e: React.FormEvent<HTMLInputElement>)
  {
    const target = e.currentTarget;
    this.props.fleet.name.customizeName(target.value);
    this.forceUpdate();
  }

  public state: StateType;

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
              `/${isNotDetected ? "???" : totalMaxHealth}`,
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
          isNotDetected ?
            localize("fleet_movesRemaining")("?", "?") :
            localize("fleet_movesRemaining")(fleet.getMinCurrentMovePoints(), fleet.getMinMaxMovePoints()),
        ),

      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(FleetInfoComponent);
export default factory;
