/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="unitinfo.ts"/>
/// <reference path="uniticon.ts"/>
/// <reference path="unitstatuseffects.ts" />
/// <reference path="unitportrait.ts" />
/// <reference path="../mixins/draggable.ts" />


import Unit from "../../../src/Unit.ts";
import UnitPortrait from "./UnitPortrait.ts";
import UnitStatusEffects from "./UnitStatusEffects.ts";
import UnitInfo from "./UnitInfo.ts";
import UnitIcon from "./UnitIcon.ts";


export interface PropTypes extends React.Props<any>
{
  // TODO refactor | add prop types
}

interface StateType
{
  // TODO refactor | add state type
}

class Unit_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "Unit";
  mixins: reactTypeTODO_any = [Draggable, React.addons.PureRenderMixin];
  
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  private getInitialState(): StateType
  {
    return(
    {
      hasPopup: false,
      popupElement: null
    });
  }

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
  handleMouseLeave(e: MouseEvent)
  {
    if (!this.props.handleMouseLeaveUnit) return;

    this.props.handleMouseLeaveUnit(e);
  }

  render()
  {
    var unit: Unit = this.props.unit;
    unit.uiDisplayIsDirty = false;

    var containerProps: any =
    {
      className: "unit-container",
      id: "unit-id_" + unit.id,
      key: "container"
    };
    var wrapperProps: any =
    {
      className: "unit"
    };

    wrapperProps.onMouseEnter = this.handleMouseEnter;
    wrapperProps.onMouseLeave = this.handleMouseLeave;

    if (this.props.isDraggable)
    {
      wrapperProps.className += " draggable";
      wrapperProps.onMouseDown = wrapperProps.onTouchStart = this.handleMouseDown;
    }

    if (this.state.dragging)
    {
      wrapperProps.style = this.dragPos;
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
      isPreparing: unit.battleStats.queuedAction,
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

const Factory: React.Factory<PropTypes> = React.createFactory(Unit_COMPONENT_TODO);
export default Factory;
