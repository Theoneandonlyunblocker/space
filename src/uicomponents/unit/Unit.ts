/// <reference path="../../../lib/react-global.d.ts" />

import Unit from "../../Unit";
import UnitPortrait from "./UnitPortrait";
import UnitPassiveEffects from "./UnitPassiveEffects";
import UnitAttributeChanges from "./UnitAttributeChanges";
import UnitInfo from "./UnitInfo";
import UnitIconContainer from "./UnitIconContainer";
import Battle from "../../Battle";
import AbilityTemplate from "../../templateinterfaces/AbilityTemplate";
import UnitDisplayData from "../../UnitDisplayData";

import {default as DragPositioner, DragPositionerProps} from "../mixins/DragPositioner";
import applyMixins from "../mixins/applyMixins";

export interface PropTypes extends React.Props<any>, UnitDisplayData
{  
  id: number;
  
  animateDuration?: number;
  
  // onUnitClick?: (unit: Unit) => void;
  onUnitClick?: () => void;
  // onMouseUp?: (position: number[]) => void;
  onMouseUp?: () => void;
  handleMouseLeaveUnit?: (e: React.MouseEvent) => void;
  // handleMouseEnterUnit?: (unit: Unit) => void;
  handleMouseEnterUnit?: () => void;
  
  isDraggable?: boolean;
  // onDragStart?: (unit: Unit) => void;
  onDragStart?: () => void;
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
    
    this.state = this.getInitialStateTODO();
    
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
  
  private getInitialStateTODO(): StateType
  {
    return(
    {
      
    });
  }
  
  shouldComponentUpdate = React.addons.PureRenderMixin.shouldComponentUpdate.bind(this);

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
  handleMouseLeave(e: React.MouseEvent)
  {
    this.props.handleMouseLeaveUnit(e);
  }

  render()
  {
    const wrapperProps: React.HTMLAttributes =
    {
      className: "unit",
      onMouseEnter: this.props.handleMouseEnterUnit ? this.handleMouseEnter : null,
      onMouseLeave: this.props.handleMouseLeaveUnit ? this.handleMouseLeave : null,
      onClick: this.props.onUnitClick ? this.handleClick : null,
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

    if (this.props.facesLeft)
    {
      wrapperProps.className += " enemy-unit";
    }
    else
    {
      wrapperProps.className += " friendly-unit";
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
      wrapperProps.className += " active-effect-unit"
    }

    const bodyElements =
    [
      React.DOM.div(
      {
        className: "unit-portrait-container",
        key: "portraitContainer"
      },
        UnitPortrait(
        {
          imageSrc: (this.props.portraitSrc || "")
        }),
        UnitPassiveEffects(
        {
          passiveEffects: this.props.passiveEffects
        }),
        UnitAttributeChanges(
        {
          attributeChanges: this.props.attributeChanges
        })
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

    if (this.props.facesLeft)
    {
      bodyElements.reverse();
    }

    if (this.props.isAnnihilated)
    {
      bodyElements.push(
        React.DOM.div({key: "overlay", className: "unit-annihilated-overlay"},
          "Unit annihilated"
        )
      );
    }

    const innerElements =
    [
      React.DOM.div(
      {
        className: "unit-body",
        id: "unit-id_" + this.props.id,
        key: "body"
      },
        bodyElements
      ),
      UnitIconContainer(
        {
          key: "icon",
          facesLeft: this.props.facesLeft,
          iconSrc: this.props.iconSrc
        })
    ];

    return(
      React.DOM.div(wrapperProps,
        this.props.facesLeft ? innerElements.reverse() : innerElements
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UnitComponent);
export default Factory;
