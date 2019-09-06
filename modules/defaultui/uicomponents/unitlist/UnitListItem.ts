import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import * as ReactDOM from "react-dom";

import {Unit} from "src/unit/Unit";
import {shallowExtend} from "src/generic/utility";
import {ListItemProps} from "../list/ListItemProps";
import {Unit as UnitComponentFactory} from "../unit/Unit";
import {UnitStrength} from "../unit/UnitStrength";

import {DragPositioner, DragPositionerProps} from "../mixins/DragPositioner";
import {applyMixins} from "../mixins/applyMixins";


export interface PropTypes extends ListItemProps, React.Props<any>
{
  id: number;
  unitName: string;
  unitTypeName: string;
  strength: string;
  maxActionPoints: number;
  attack: number;
  defence: number;
  intelligence: number;
  speed: number;

  isHovered: boolean;
  currentHealth: number;
  isReserved: boolean;
  isUnavailable: boolean;
  isSelected: boolean;
  onMouseEnter?: (unit: Unit) => void;
  onMouseLeave?: () => void;
  onMouseUp?: (unit: Unit) => void;
  maxHealth: number;
  unit: Unit;

  isDraggable: boolean;
  onDragEnd?: (dropSuccessful?: boolean) => void;
  onDragStart?: (unit: Unit) => void;
  dragPositionerProps?: DragPositionerProps;
}

interface StateType
{
}
export class UnitListItemComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "UnitListItem";
  public state: StateType;

  private readonly dragPositioner: DragPositioner<UnitListItemComponent>;
  private readonly ownDOMNode = React.createRef<HTMLTableRowElement>();

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();

    if (this.props.isDraggable)
    {
      this.dragPositioner = new DragPositioner(this, this.ownDOMNode, this.props.dragPositionerProps);
      this.dragPositioner.onDragStart = this.onDragStart;
      this.dragPositioner.makeDragClone = this.makeDragClone;
      // this.dragPositioner.onDragMove = this.onDragMove;
      this.dragPositioner.onDragEnd = this.onDragEnd;
      applyMixins(this, this.dragPositioner);
    }
  }

  public componentDidMount()
  {
    if (!this.props.isDraggable) { return; }

    const container = <HTMLElement> document.getElementsByClassName("unit-wrapper")[0];

    this.dragPositioner.forcedDragOffset =
    {
      x: container.offsetWidth / 2,
      y: container.offsetHeight / 2,
    };
  }
  public render(): React.ReactElement<any>
  {
    const columns = this.props.activeColumns;

    const cells: React.ReactElement<any>[] = [];

    for (let i = 0; i < columns.length; i++)
    {
      const cell = this.makeCell(columns[i].key);

      cells.push(cell);
    }

    const rowProps: React.HTMLAttributes<HTMLTableRowElement> & React.ClassAttributes<HTMLTableRowElement> =
    {
      className: "unit-list-item",
      onClick : this.props.handleClick,
      ref: this.ownDOMNode,
    };

    if (this.props.isDraggable && !this.props.isUnavailable)
    {
      rowProps.className += " draggable";
      rowProps.onTouchStart = rowProps.onMouseDown =
        this.dragPositioner.handleReactDownEvent;
    }


    if (this.props.isSelected)
    {
      rowProps.className += " selected-unit";
    }
    if (this.props.isReserved)
    {
      rowProps.className += " reserved-unit";
    }
    if (this.props.isUnavailable)
    {
      rowProps.className += " unavailable-unit";
    }
    if (this.props.isHovered)
    {
      rowProps.className += " unit-list-item-hovered";
    }
    if (this.props.onMouseEnter && this.props.onMouseLeave)
    {
      rowProps.onMouseEnter = this.handleMouseEnter;
      rowProps.onMouseLeave = this.handleMouseLeave;
    }
    if (this.props.onMouseUp)
    {
      rowProps.onMouseUp = this.handleMouseUp;
    }


    return(
      ReactDOMElements.tr(rowProps,
        cells,
      )
    );
  }

  private bindMethods(): void
  {
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.makeCell = this.makeCell.bind(this);

    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.makeDragClone = this.makeDragClone.bind(this);
    // this.onDragMove = this.onDragMove.bind(this);
  }
  private onDragStart()
  {
    if (!this.props.onDragStart)
    {
      throw new Error("Draggable list item must specify props.onDragStart handler");
    }
    this.props.onDragStart(this.props.unit);
  }
  private makeDragClone()
  {
    const container = document.createElement("div");

    ReactDOM.render(
      UnitComponentFactory(shallowExtend(
        this.props.unit.getDisplayData("battlePrep"),
        {id: this.props.unit.id},
      )),
      container,
    );

    const renderedElement = <HTMLElement> container.firstChild;
    const wrapperElement = <HTMLElement> document.getElementsByClassName("unit-wrapper")[0];

    renderedElement.classList.add("draggable", "dragging");

    renderedElement.style.width = "" + wrapperElement.offsetWidth + "px";
    renderedElement.style.height = "" + wrapperElement.offsetHeight + "px";
    this.dragPositioner.forcedDragOffset =
    {
      x: wrapperElement.offsetWidth / 2,
      y: wrapperElement.offsetHeight / 2,
    };

    return renderedElement;
  }
  private onDragEnd()
  {
    this.props.onDragEnd();
  }
  private handleMouseEnter()
  {
    this.props.onMouseEnter(this.props.unit);
  }
  private handleMouseLeave()
  {
    this.props.onMouseLeave();
  }
  private handleMouseUp(): void
  {
    this.props.onMouseUp(this.props.unit);
  }
  private makeCell(type: string): React.ReactHTMLElement<HTMLTableDataCellElement>
  {
    const unit = this.props.unit;

    const cellContent: string | number | React.ReactElement<any> = (() =>
    {
      switch (type)
      {
        case "strength":
        {
          return UnitStrength(
          {
            maxHealth: this.props.maxHealth,
            currentHealth: this.props.currentHealth,
            isSquadron: true,
          });
        }
        default:
        {
          return this.props[type];
        }
      }
    })();

    const cellProps: React.HTMLProps<HTMLTableDataCellElement> = (() =>
    {
      const props: React.HTMLProps<HTMLTableDataCellElement> = {};
      props.key = type;
      props.className = "unit-list-item-cell" + " unit-list-" + type;

      switch (type)
      {
        case "unitName":
        {
          props.title = this.props.unitName;

          break;
        }
        case "unitTypeName":
        {
          props.title = this.props.unitTypeName;

          break;
        }
        case "attack":
        case "defence":
        case "intelligence":
        case "speed":
        {
          if (unit.attributes[type] < unit.baseAttributes[type])
          {
            props.className += " lowered-stat";
          }
          else if (unit.attributes[type] > unit.baseAttributes[type])
          {
            props.className += " raised-stat";
          }

          break;
        }
      }

      return props;
    })();

    return(
      ReactDOMElements.td(cellProps, cellContent)
    );
  }
}

export const UnitListItem: React.Factory<PropTypes> = React.createFactory(UnitListItemComponent);
