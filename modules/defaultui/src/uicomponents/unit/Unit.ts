import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import {options} from "core/src/app/Options";
import {UnitDisplayData} from "core/src/unit/UnitDisplayData";
import {DragPositioner, DragPositionerProps} from "../mixins/DragPositioner";
import {applyMixins} from "../mixins/applyMixins";

import {UnitAttributeChanges} from "./UnitAttributeChanges";
import {UnitIconContainer} from "./UnitIconContainer";
import {UnitInfo} from "./UnitInfo";
import {UnitPortrait} from "./UnitPortrait";
import { UnitCombatEffects } from "./UnitCombatEffects";


export interface ComponentPropTypes extends React.Props<any>
{
  id: number;

  animateDuration?: number;

  onUnitClick?: () => void;
  onMouseUp?: () => void;

  handleMouseLeaveUnit?: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseEnterUnit?: () => void;

  isDraggable?: boolean;
  onDragStart?: () => void;
  onDragEnd?: (dropSuccessful?: boolean) => void;
  dragPositionerProps?: DragPositionerProps;
}

export interface DisplayStatus
{
  wasDestroyed?: boolean;
  wasCaptured?: boolean;

  isInBattlePrep?: boolean;
  isActiveUnit?: boolean;
  isHovered?: boolean;
  isInPotentialTargetArea?: boolean;
  isTargetOfActiveEffect?: boolean;
  hoveredActionPointExpenditure?: number;
}

export interface PropTypes extends ComponentPropTypes, UnitDisplayData, DisplayStatus
{

}

interface StateType
{
}

export class UnitComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName = "Unit";
  public override state: StateType;

  dragPositioner: DragPositioner<UnitComponent>;
  private readonly ownDOMNode = React.createRef<HTMLDivElement>();

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
    if (this.props.isDraggable)
    {
      this.dragPositioner = new DragPositioner(this, this.ownDOMNode, this.props.dragPositionerProps);
      this.dragPositioner.onDragStart = this.onDragStart;
      this.dragPositioner.onDragEnd = this.onDragEnd;
      applyMixins(this, this.dragPositioner);
    }
  }
  private bindMethods()
  {
    this.handleClick = this.handleClick.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  private getInitialStateTODO(): StateType
  {
    return(
    {

    });
  }

  onDragStart()
  {
    this.props.onDragStart();
  }
  onDragEnd()
  {
    this.props.onDragEnd();
  }

  handleClick()
  {
    this.props.onUnitClick();
  }

  handleMouseEnter()
  {
    this.props.handleMouseEnterUnit();
  }
  handleMouseLeave(e: React.MouseEvent<HTMLDivElement>)
  {
    this.props.handleMouseLeaveUnit(e);
  }

  public override render()
  {
    const wrapperProps: React.HTMLAttributes<HTMLDivElement> & React.ClassAttributes<HTMLDivElement> =
    {
      className: "unit",
      onMouseEnter: this.props.handleMouseEnterUnit ? this.handleMouseEnter : null,
      onMouseLeave: this.props.handleMouseLeaveUnit ? this.handleMouseLeave : null,
      onClick: this.props.onUnitClick ? this.handleClick : null,
      onMouseUp: this.props.onMouseUp,
      ref: this.ownDOMNode,
    };

    if (this.props.isDraggable)
    {
      wrapperProps.className += " draggable";
      wrapperProps.onMouseDown = wrapperProps.onTouchStart = this.dragPositioner.handleReactDownEvent;

      if (this.dragPositioner.isDragging)
      {
        wrapperProps.style = this.dragPositioner.getStyleAttributes();
        wrapperProps.className += " dragging";
      }
    }

    if (this.props.isFacingRight)
    {
      wrapperProps.className += " friendly-unit";
    }
    else
    {
      wrapperProps.className += " enemy-unit";
    }
    if (this.props.isActiveUnit)
    {
      wrapperProps.className += " active-unit";
    }
    if (this.props.isInPotentialTargetArea)
    {
      wrapperProps.className += " target-unit";
    }
    if (this.props.isHovered)
    {
      wrapperProps.className += " hovered-unit";
    }
    if (this.props.isTargetOfActiveEffect)
    {
      wrapperProps.className += " active-effect-unit";
    }
    if (options.debug.enabled)
    {
      wrapperProps.title = `id: ${this.props.id}`;
    }

    const bodyElements =
    [
      ReactDOMElements.div(
      {
        className: "unit-portrait-container",
        key: "portraitContainer",
      },
        UnitPortrait(
        {
          imageSrc: (this.props.portraitSrc || ""),
        }),
        UnitCombatEffects(
        {
          effects: this.props.combatEffects,
        }),
        UnitAttributeChanges(
        {
          attributeChanges: this.props.attributeChanges,
        }),
      ),
      UnitInfo(
      {
        key: "info",
        name: this.props.name,
        guardAmount: this.props.guardAmount,
        guardType: this.props.guardType,
        isPreparing: this.props.isPreparing,
        maxHealth: this.props.maxHealth,
        currentHealth: this.props.currentHealth,
        currentActionPoints: this.props.currentActionPoints,
        maxActionPoints: this.props.maxActionPoints,
        hoveredActionPointExpenditure: this.props.hoveredActionPointExpenditure,
        isSquadron: this.props.isSquadron,
        wasDestroyed: this.props.wasDestroyed,
        wasCaptured: this.props.wasCaptured,

        animateDuration: this.props.animateDuration,
      }),
    ];

    if (!this.props.isFacingRight)
    {
      bodyElements.reverse();
    }

    if (this.props.isAnnihilated)
    {
      bodyElements.push(
        ReactDOMElements.div({key: "overlay", className: "unit-annihilated-overlay"},
          localize("unitAnnihilated").toString(),
        ),
      );
    }

    const innerElements =
    [
      ReactDOMElements.div(
      {
        className: "unit-body",
        id: "unit-id_" + this.props.id,
        key: "body",
      },
        bodyElements,
      ),
      UnitIconContainer(
        {
          key: "icon",
          isFacingRight: this.props.isFacingRight,
          iconSrc: this.props.iconSrc,
        }),
    ];

    return(
      ReactDOMElements.div(wrapperProps,
        !this.props.isFacingRight ? innerElements.reverse() : innerElements,
      )
    );
  }
}

export const Unit: React.Factory<PropTypes> = React.createFactory(UnitComponent);
