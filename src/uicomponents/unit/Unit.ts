/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react/addons";

import Unit from "../../Unit";
import UnitPortrait from "./UnitPortrait";
import UnitStatusEffects from "./UnitStatusEffects";
import UnitInfo from "./UnitInfo";
import UnitIcon from "./UnitIcon";
import Battle from "../../Battle";
import AbilityTemplate from "../../templateinterfaces/AbilityTemplate";

import {default as DragPositioner, DragPositionerProps} from "../mixins/DragPositioner";
import applyMixins from "../mixins/applyMixins";

interface PropTypes extends React.Props<any>
{
  isCaptured?: boolean;
  isDead?: boolean;
  position?: number[];
  unit: Unit;
  
  battle?: Battle;
  facesLeft: boolean;
  activeUnit?: Unit;
  activeTargets?: {[id: number]: AbilityTemplate[];}; 

  hoveredUnit?: Unit;
  hoveredAbility?: AbilityTemplate;

  targetsInPotentialArea?: Unit[];
  activeEffectUnits?: Unit[];
  
  onUnitClick?: (unit: Unit) => void;
  onMouseUp?: (position: number[]) => void;
  handleMouseLeaveUnit?: (e: React.MouseEvent) => void;
  handleMouseEnterUnit?: (unit: Unit) => void;
  
  isDraggable?: boolean;
  onDragStart?: (unit: Unit) => void;
  onDragEnd?: (dropSuccessful?: boolean) => void;
  dragPositionerProps?: DragPositionerProps;
}

interface StateType
{
}

export class UnitComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "Unit";
  state: StateType;
  
  dragPositioner: DragPositioner<UnitComponent>;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
    if (this.props.isDraggable)
    {
      this.dragPositioner = new DragPositioner(this, this.props.dragPositionerProps);
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
  
  private getInitialState(): StateType
  {
    return(
    {
      
    });
  }
  
  componentShouldUpdate = React.addons.PureRenderMixin.shouldComponentUpdate.bind(this);

  onDragStart()
  {
    this.props.onDragStart(this.props.unit);
  }
  onDragEnd()
  {
    this.props.onDragEnd();
  }

  handleClick()
  {
    this.props.onUnitClick(this.props.unit);
  }

  handleMouseEnter()
  {
    if (!this.props.handleMouseEnterUnit) return;
    if (this.props.unit.currentHealth <= 0) return;

    this.props.handleMouseEnterUnit(this.props.unit);
  }
  handleMouseLeave(e: React.MouseEvent)
  {
    if (!this.props.handleMouseLeaveUnit) return;

    this.props.handleMouseLeaveUnit(e);
  }

  render()
  {
    var unit = this.props.unit;
    unit.uiDisplayIsDirty = false;

    var containerProps: React.HTMLAttributes =
    {
      className: "unit-container",
      id: "unit-id_" + unit.id,
      key: "container"
    };
    var wrapperProps: React.HTMLAttributes =
    {
      className: "unit"
    };

    wrapperProps.onMouseEnter = this.handleMouseEnter;
    wrapperProps.onMouseLeave = this.handleMouseLeave;

    if (this.props.isDraggable)
    {
      wrapperProps.className += " draggable";
      wrapperProps.onMouseDown = wrapperProps.onTouchStart = this.dragPositioner.handleReactDownEvent;
    }

    if (this.dragPositioner.isDragging)
    {
      wrapperProps.style = this.dragPositioner.getStyleAttributes();
      wrapperProps.className += " dragging";
    }

    if (this.props.onUnitClick)
    {
      wrapperProps.onClick = this.handleClick;
    }

    if (this.props.facesLeft)
    {
      wrapperProps.className += " enemy-unit";
    }
    else
    {
      wrapperProps.className += " friendly-unit";
    }

    var isActiveUnit = ( this.props.activeUnit &&
      unit.id === this.props.activeUnit.id);

    if (isActiveUnit)
    {
      wrapperProps.className += " active-unit";
    }

    var isInPotentialTargetArea = (this.props.targetsInPotentialArea &&
      this.props.targetsInPotentialArea.indexOf(unit) >= 0);

    if (isInPotentialTargetArea)
    {
      wrapperProps.className += " target-unit";
    }

    if (this.props.hoveredUnit && this.props.hoveredUnit.id === unit.id)
    {
      wrapperProps.className += " hovered-unit";
    }

    var hoveredActionPointExpenditure = 0;
    if (isActiveUnit && this.props.hoveredAbility)
    {
      hoveredActionPointExpenditure = this.props.hoveredAbility.actionsUse;
    }

    var infoProps =
    {
      key: "info",
      name: unit.name,
      guardAmount: unit.battleStats.guardAmount,
      guardCoverage: unit.battleStats.guardCoverage,
      isPreparing: Boolean(unit.battleStats.queuedAction),
      maxHealth: unit.maxHealth,
      currentHealth: unit.currentHealth,
      isSquadron: unit.isSquadron,
      maxActionPoints: unit.attributes.maxActionPoints,
      currentActionPoints: unit.battleStats.currentActionPoints,
      hoveredActionPointExpenditure: hoveredActionPointExpenditure,

      isDead: this.props.isDead,
      isCaptured: this.props.isCaptured,

      animateDuration: unit.sfxDuration
    }

    var containerElements =
    [
      React.DOM.div(
      {
        className: "unit-left-container",
        key: "leftContainer"
      },
        UnitPortrait(
        {
          imageSrc: (unit.portrait ? unit.portrait.imageSrc : "")
        }),
        UnitStatusEffects(
        {
          unit: unit,
          isBattlePrep: !this.props.battle
        })
      ),
      UnitInfo(infoProps),
    ];

    if (this.props.facesLeft)
    {
      containerElements = containerElements.reverse();
    }

    if (unit.displayFlags.isAnnihilated)
    {
      containerElements.push(
        React.DOM.div({key: "overlay", className: "unit-annihilated-overlay"},
          "Unit annihilated"
        )
      );
    }

    var allElements =
    [
      React.DOM.div(containerProps,
        containerElements
      ),
      UnitIcon(
        {
          icon: unit.template.icon,
          facesLeft: this.props.facesLeft,
          key: "icon",
          isActiveUnit: isActiveUnit,
          isAnnihilated: unit.displayFlags.isAnnihilated
        })
    ];

    if (this.props.facesLeft)
    {
      allElements = allElements.reverse();
    }

    return(
      React.DOM.div(wrapperProps,
        allElements
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UnitComponent);
export default Factory;
