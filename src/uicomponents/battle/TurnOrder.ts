/// <reference path="../../../lib/react-global.d.ts" />

import Unit from "../../Unit";
import TurnOrderDisplayData from "../../TurnOrderDisplayData";

import
{
  default as TurnOrderUnit,
  AnimationState
} from "./TurnOrderUnit";

// TODO | animate units being removed from turn order

export interface PropTypes extends React.Props<any>
{
  unitsBySide:
  {
    side1: Unit[];
    side2: Unit[];
  }
  turnOrderDisplayData: TurnOrderDisplayData[];
  hoveredUnit: Unit;
  hoveredGhostIndex: number;
  
  turnIsTransitioning: boolean;
  turnTransitionDuration: number;
  
  onMouseLeaveUnit: (e: React.MouseEvent) => void;
  onMouseEnterUnit: (unit: Unit) => void;
}

interface StateType
{
  maxUnits?: number;
  
  currentDisplayData?: TurnOrderDisplayData[];
  pendingDisplayData?: TurnOrderDisplayData[];
  
  insertIndex?: number;
  
  animationState?: AnimationState;
}

export class TurnOrderComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "TurnOrder";
  state: StateType;
  animationDuration: number;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialStateTODO();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.setMaxUnits = this.setMaxUnits.bind(this);    
  }
  
  private getInitialStateTODO(): StateType
  {
    return(
    {
      maxUnits: 7,
      
      currentDisplayData: this.props.turnOrderDisplayData,
      pendingDisplayData: undefined,
      
      insertIndex: undefined,
      
      animationState: AnimationState.idle
    });
  }
  componentDidMount()
  {
    this.setMaxUnits();

    window.addEventListener("resize", this.setMaxUnits);
  }
  componentWillUnmount()
  {
    window.removeEventListener("resize", this.setMaxUnits);
  }
  componentWillReceiveProps(newProps: PropTypes)
  {
    if (newProps.turnIsTransitioning && !this.props.turnIsTransitioning)
    {
      const removedUnit = this.state.currentDisplayData[0].unit;
      
      let newRemovedUnitIndex: number;
      for (let i = 0; i < newProps.turnOrderDisplayData.length; i++)
      {
        if (newProps.turnOrderDisplayData[i].unit === removedUnit)
        {
          newRemovedUnitIndex = i;
          break;
        }
      }
      
      const unitsToRender = Math.min(newProps.turnOrderDisplayData.length, this.state.maxUnits);
      const shouldInsertRemovedUnit = newRemovedUnitIndex < unitsToRender - 1;
      
      this.setState(
      {
        pendingDisplayData: newProps.turnOrderDisplayData,
        
        insertIndex: shouldInsertRemovedUnit ? newRemovedUnitIndex : undefined,
      });
      
      this.removeUnit(shouldInsertRemovedUnit, newRemovedUnitIndex);
    }
  }
  
  private getTransitionDuration()
  {
    return this.props.turnTransitionDuration / 3;
  }
  private setFinishAnimatingTimeout()
  {
    window.setTimeout(() =>
    {
      this.setState(
      {
        animationState: AnimationState.idle,
        
      });
    }, this.getTransitionDuration())
  }
  private removeUnit(shouldInsertRemovedUnit: boolean, insertIndex: number)
  {
    this.setState(
    {
      animationState: AnimationState.removeUnit
    }, () =>
    {
      window.setTimeout(() =>
      {
        this.setState(
        {
          currentDisplayData: this.state.currentDisplayData.slice(1),
        });
        
        if (shouldInsertRemovedUnit)
        {
          this.clearSpaceForUnit();
        }
        else
        {
          this.pushUnit();
        }
      }, this.getTransitionDuration());
    });
  }
  private clearSpaceForUnit()
  {
    this.setState(
    {
      animationState: AnimationState.clearSpaceForUnit,
    }, () =>
    {
      window.setTimeout(() =>
      {
        this.insertUnit();
      }, this.getTransitionDuration());
    });
  }
  private insertUnit()
  {
    this.setState(
    {
      currentDisplayData: this.state.pendingDisplayData,
      pendingDisplayData: undefined,
      
      animationState: AnimationState.insertUnit
    }, () =>
    {
      this.setFinishAnimatingTimeout();
    });
  }
  private pushUnit()
  {
    this.setState(
    {
      currentDisplayData: this.state.pendingDisplayData,
      pendingDisplayData: undefined,
      
      animationState: AnimationState.pushUnit
    }, () =>
    {
      this.setFinishAnimatingTimeout();
    });
  }
  
  private setMaxUnits()
  {
    const minUnits = 7;

    const containerElement = ReactDOM.findDOMNode(this);

    const containerWidth = containerElement.getBoundingClientRect().width - 30;
    const unitElementWidth = 160;

    const ceil = Math.ceil(containerWidth / unitElementWidth);

    this.setState(
    {
      maxUnits: Math.max(ceil, minUnits)
    });
  }

  render()
  {
    const toRender: React.ReactElement<any>[] = [];
    
    const unitsToRender = Math.min(this.state.currentDisplayData.length, this.state.maxUnits);
    const transitionDuration = this.getTransitionDuration();
    
    for (let i = 0; i < unitsToRender; i++)
    {
      const displayData = this.state.currentDisplayData[i];
      
      let unitAnimationState: AnimationState = AnimationState.idle;
      
      switch (this.state.animationState)
      {
        case AnimationState.removeUnit:
        {
          if (i === 0)
          {
            unitAnimationState = AnimationState.removeUnit;
          }
          break;
        }
        case AnimationState.clearSpaceForUnit:
        {
          if (i === this.state.insertIndex)
          {
            unitAnimationState = AnimationState.clearSpaceForUnit;
          }
          break;
        }
        case AnimationState.insertUnit:
        {
          if (i === this.state.insertIndex)
          {
            unitAnimationState = AnimationState.insertUnit;
          }
          break;
        }
        case AnimationState.pushUnit:
        {
          if (i === unitsToRender - 1)
          {
            unitAnimationState = AnimationState.pushUnit;
          }
          break;
        }
      }
      
      // todo pass animation state
      toRender.push(
        TurnOrderUnit(
        {
          key: displayData.unit.id,
          unitName: displayData.unit.name,
          delay: displayData.moveDelay,
          isFriendly: this.props.unitsBySide.side1.indexOf(displayData.unit) > -1,
          isHovered: this.props.hoveredUnit && displayData.unit === this.props.hoveredUnit,
          
          animationState: unitAnimationState,
          transitionDuration: transitionDuration,
          
          onMouseEnter: this.props.onMouseEnterUnit.bind(null, displayData.unit),
          onMouseLeave: this.props.onMouseLeaveUnit,
        })
      );
    }
    
    if (isFinite(this.props.hoveredGhostIndex))
    {
      toRender.splice(this.props.hoveredGhostIndex, 0, React.DOM.div(
      {
        className: "turn-order-arrow",
        key: "ghost"
      }));
    }

    // if (this.props.turnOrderDisplayData.length > maxUnits)
    // {
    //   toRender.push(React.DOM.div(
    //   {
    //     className: "turn-order-more",
    //     key: "more"
    //   }, "..."));
    // }

    return(
      React.DOM.div({className: "turn-order-container"},
        toRender
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(TurnOrderComponent);
export default Factory;
