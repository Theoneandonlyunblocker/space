import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import {Fleet} from "core/src/fleets/Fleet";

import {FleetControls} from "./FleetControls";


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
    this.props.fleet.name.customize(target.value);
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
      ReactDOMElements.div(
      {
        className: "fleet-info" + (fleet.isStealthy ? " stealthy" : ""),
      },
        ReactDOMElements.div(
        {
          className: "fleet-info-header",
        },
          ReactDOMElements.input(
          {
            className: "fleet-info-name",
            value: isNotDetected ? localize("unidentifiedFleet").toString() : fleet.name.baseName,
            title: isNotDetected ? localize("unidentifiedFleet").toString() : fleet.name.baseName,
            onChange: isNotDetected ? null : this.setFleetName,
            readOnly: isNotDetected,
          }),
          ReactDOMElements.div(
          {
            className: "fleet-info-strength",
          },
            ReactDOMElements.span(
            {
              className: "fleet-info-strength-current" + healthStatus,
            },
              isNotDetected ? "???" : totalCurrentHealth,
            ),
            ReactDOMElements.span(
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
        ReactDOMElements.div(
        {
          className: "fleet-info-move-points",
        },
          isNotDetected ?
            localize("fleet_movesRemaining").format("?", "?") :
            localize("fleet_movesRemaining").format(fleet.getMinCurrentMovePoints(), fleet.getMinMaxMovePoints()),
        ),

      )
    );
  }
}

export const FleetInfo: React.Factory<PropTypes> = React.createFactory(FleetInfoComponent);
