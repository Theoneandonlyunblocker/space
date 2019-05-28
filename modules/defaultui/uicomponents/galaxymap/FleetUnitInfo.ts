import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import Unit from "../../Unit";
import DragPositioner from "../mixins/DragPositioner";
import applyMixins from "../mixins/applyMixins";
import UnitStrength from "../unit/UnitStrength";

import FleetUnitInfoName from "./FleetUnitInfoName";


export interface PropTypes extends React.Props<any>
{
  unit?: Unit;
  isIdentified: boolean;
  isDraggable: boolean;
  onDragStart?: (unit: Unit) => void;
  onDragEnd?: () => void;
}

interface StateType
{
}

export class FleetUnitInfoComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "FleetUnitInfo";
  public state: StateType;

  dragPositioner: DragPositioner<FleetUnitInfoComponent>;
  private readonly ownDOMNode = React.createRef<HTMLDivElement>();

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();

    if (this.props.isDraggable)
    {
      this.dragPositioner = new DragPositioner(this, this.ownDOMNode);
      this.dragPositioner.onDragStart = this.onDragStart;
      this.dragPositioner.onDragEnd = this.onDragEnd;
      applyMixins(this, this.dragPositioner);
    }
  }
  private bindMethods()
  {
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
  }

  onDragStart()
  {
    this.props.onDragStart(this.props.unit);
  }
  onDragEnd()
  {
    this.props.onDragEnd();
  }

  render()
  {
    const unit = this.props.unit;
    const isNotDetected = !this.props.isIdentified;

    const divProps: React.HTMLAttributes<HTMLDivElement> & React.ClassAttributes<HTMLDivElement> =
    {
      className: "fleet-unit-info",
      ref: this.ownDOMNode,
    };

    if (this.props.isDraggable)
    {
      divProps.className += " draggable";
      divProps.onTouchStart = divProps.onMouseDown =
        this.dragPositioner.handleReactDownEvent;

      if (this.dragPositioner.isDragging)
      {
        divProps.style = this.dragPositioner.getStyleAttributes();
        divProps.className += " dragging";
      }
    }

    return(
      ReactDOMElements.div(divProps,
        ReactDOMElements.div(
        {
          className: "fleet-unit-info-icon-container",
        },
          ReactDOMElements.img(
          {
            className: "fleet-unit-info-icon",
            src: isNotDetected ? "img/icons/unDetected.png" : unit.template.getIconSrc(),
          }),
        ),
        ReactDOMElements.div(
        {
          className: "fleet-unit-info-info",
        },
          FleetUnitInfoName(
          {
            unit: unit,
            isNotDetected: isNotDetected,
          }),
          ReactDOMElements.div(
          {
            className: "fleet-unit-info-type",
          },
            isNotDetected ? "???" : unit.template.displayName,
          ),
        ),
        UnitStrength(
        {
          maxHealth: unit.maxHealth,
          currentHealth: unit.currentHealth,
          isSquadron: true,
          isNotDetected: isNotDetected,
        }),

      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(FleetUnitInfoComponent);
export default factory;
