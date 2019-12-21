import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Unit} from "core/src/unit/Unit";

import {localize} from "../../../localization/localize";
import { EditableName } from "../generic/EditableName";


export interface PropTypes extends React.Props<any>
{
  unit: Unit;
  isNotDetected: boolean;
}

interface StateType
{

}

export class FleetUnitInfoNameComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "FleetUnitInfoName";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public render()
  {
    if (this.props.isNotDetected)
    {
      return ReactDOMElements.input(
      {
        className: "fleet-unit-info-name",
        value: localize("unidentifiedShip").toString(),
        readOnly: true,
      });
    }
    else
    {
      return EditableName(
      {
        name: this.props.unit.name,
        usage: "unit",
        inputAttributes:
        {
          className: "fleet-unit-info-name",
        },
      });
    }
  }
}

export const FleetUnitInfoName: React.Factory<PropTypes> = React.createFactory(FleetUnitInfoNameComponent);
