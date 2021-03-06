import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Fleet} from "core/src/fleets/Fleet";
import {Player} from "core/src/player/Player";
import {Unit} from "core/src/unit/Unit";

import {FleetUnitInfo} from "./FleetUnitInfo";


export interface PropTypes extends React.Props<any>
{
  fleet: Fleet;
  player?: Player;
  onMouseUp?: (fleet: Fleet) => void;
  onDragStart?: (unit: Unit) => void;
  onDragEnd?: () => void;
}

interface StateType
{
}

export class FleetContentsComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "FleetContents";


  public override state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  handleMouseUp()
  {
    if (!this.props.onMouseUp) { return; }

    this.props.onMouseUp(this.props.fleet);
  }

  public override render()
  {
    const fleetUnitInfos: React.ReactElement<any>[] = [];
    const fleet = this.props.fleet;

    const hasDraggableContent = Boolean(
      this.props.onDragStart ||
      this.props.onDragEnd,
    );

    for (let i = 0; i < fleet.units.length; i++)
    {
      const unit = fleet.units[i];
      fleetUnitInfos.push(FleetUnitInfo(
      {
        key: unit.id,
        unit: unit,
        isDraggable: hasDraggableContent,
        onDragStart: this.props.onDragStart,
        onDragEnd: this.props.onDragEnd,
        isIdentified: this.props.player.unitIsIdentified(unit),
      }));
    }

    if (hasDraggableContent)
    {
      fleetUnitInfos.push(ReactDOMElements.div(
      {
        className: "fleet-contents-dummy-unit",
        key: "dummy",
      }));
    }

    return(
      ReactDOMElements.div(
      {
        className: "fleet-contents",
        onMouseUp: this.handleMouseUp,
      },
        fleetUnitInfos,
      )
    );
  }

}

export const FleetContents: React.Factory<PropTypes> = React.createFactory(FleetContentsComponent);
