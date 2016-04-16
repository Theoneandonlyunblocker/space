/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react/addons";

import Player from "../../Player";
import FleetUnitInfo from "./FleetUnitInfo";
import Fleet from "../../Fleet";
import Unit from "../../Unit";


interface PropTypes extends React.Props<any>
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
  displayName: string = "FleetContents";


  state: StateType;

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
    if (!this.props.onMouseUp) return;

    this.props.onMouseUp(this.props.fleet);
  }

  render()
  {
    var fleetUnitInfos: React.ReactElement<any>[] = [];
    var fleet = this.props.fleet;

    var hasDraggableContent = Boolean(
      this.props.onDragStart ||
      this.props.onDragEnd
    );

    for (var i = 0; i < fleet.units.length; i++)
    {
      var unit = fleet.units[i];
      fleetUnitInfos.push(FleetUnitInfo(
      {
        key: unit.id,
        unit: unit,
        isDraggable: hasDraggableContent,
        onDragStart: this.props.onDragStart,
        onDragEnd: this.props.onDragEnd,
        isIdentified: this.props.player.unitIsIdentified(unit)
      }));
    }

    if (hasDraggableContent)
    {
      fleetUnitInfos.push(React.DOM.div(
      {
        className: "fleet-contents-dummy-unit",
        key: "dummy"
      }));
    }

    return(
      React.DOM.div(
      {
        className: "fleet-contents",
        onMouseUp: this.handleMouseUp
      },
        fleetUnitInfos
      )
    );
  }

}

const Factory: React.Factory<PropTypes> = React.createFactory(FleetContentsComponent);
export default Factory;
