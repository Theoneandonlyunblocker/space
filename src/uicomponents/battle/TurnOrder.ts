import * as React from "react";
import * as ReactDOM from "react-dom";

import TurnOrderDisplayData from "../../TurnOrderDisplayData";
import Unit from "../../Unit";

import
{
  AnimationState,
  default as TurnOrderUnit,
} from "./TurnOrderUnit";

export interface PropTypes extends React.Props<any>
{
  unitsBySide:
  {
    side1: Unit[];
    side2: Unit[];
  };
  turnOrderDisplayData: TurnOrderDisplayData[];
  hoveredUnit: Unit;
  hoveredGhostIndex: number;

  turnIsTransitioning: boolean;
  turnTransitionDuration: number;

  onMouseLeaveUnit: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnterUnit: (unit: Unit) => void;
}

interface StateType
{
  maxUnits: number;

  currentDisplayData: TurnOrderDisplayData[];
  pendingDisplayData: TurnOrderDisplayData[];
  pendingDeadUnitsById: {[id: number]: boolean};
  pendingDeadUnitIndices: {[index: number]: boolean};

  insertIndex: number;

  animationState: AnimationState;
}

export class TurnOrderComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "TurnOrder";
  state: StateType;

  timeoutHandle: number;

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
      pendingDeadUnitsById: {},
      pendingDeadUnitIndices: {},

      insertIndex: undefined,

      animationState: AnimationState.Idle,
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
    if (isFinite(this.timeoutHandle))
    {
      window.clearTimeout(this.timeoutHandle);
    }
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

      const pendingDeadUnitsById: {[id: number]: boolean} = {};
      this.props.turnOrderDisplayData.forEach(currentDisplayData =>
      {
        const unit = currentDisplayData.unit;
        if (!newProps.turnOrderDisplayData.some(newDisplayData =>
        {
          return newDisplayData.unit === unit;
        }))
        {
          pendingDeadUnitsById[unit.id] = true;
        }
      });

      const unitsToRender = Math.min(newProps.turnOrderDisplayData.length, this.state.maxUnits);
      const shouldInsertRemovedUnit = newRemovedUnitIndex < unitsToRender - 1;

      this.setState(
      {
        pendingDisplayData: newProps.turnOrderDisplayData,
        pendingDeadUnitsById: pendingDeadUnitsById,

        insertIndex: shouldInsertRemovedUnit ? newRemovedUnitIndex : undefined,
      }, () =>
      {
        this.removeDeadUnits();
      });
    }
  }

  private getTransitionDuration()
  {
    return this.props.turnTransitionDuration / 4;
  }
  private setFinishAnimatingTimeout()
  {
    this.timeoutHandle = window.setTimeout(() =>
    {
      this.setState(
      {
        animationState: AnimationState.Idle,

      });
    }, this.getTransitionDuration());
  }
  private removeDeadUnits()
  {
    if (Object.keys(this.state.pendingDeadUnitsById).length > 0)
    {
      const deadUnitIndices: {[index: number]: boolean} = {};

      this.state.currentDisplayData.forEach((displayData, i) =>
      {
        if (this.state.pendingDeadUnitsById[displayData.unit.id])
        {
          deadUnitIndices[i] = true;
        }
      });

      this.setState(
      {
        animationState: AnimationState.RemoveDeadUnit,
        pendingDeadUnitIndices: deadUnitIndices,
      }, () =>
      {
        this.timeoutHandle = window.setTimeout(() =>
        {
          this.fillSpaceLeftByDeadUnits();
        }, this.getTransitionDuration());
      });
    }
    else
    {
      this.removeUnit();
    }
  }
  private fillSpaceLeftByDeadUnits()
  {
    this.setState(
    {
      animationState: AnimationState.FillSpaceLeftByDeadUnits,
    }, () =>
    {
      this.timeoutHandle = window.setTimeout(() =>
      {
        this.setState(
        {
          currentDisplayData: this.state.currentDisplayData.filter(d =>
          {
            return !this.state.pendingDeadUnitsById[d.unit.id];
          }),
        }, () =>
        {
          this.removeUnit();
        });
      }, this.getTransitionDuration());
    });
  }
  private removeUnit()
  {
    this.setState(
    {
      animationState: AnimationState.RemoveUnit,
    }, () =>
    {
      this.timeoutHandle = window.setTimeout(() =>
      {
        this.setState(
        {
          currentDisplayData: this.state.currentDisplayData.slice(1),
        });

        if (isFinite(this.state.insertIndex))
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
      animationState: AnimationState.ClearSpaceForUnit,
    }, () =>
    {
      this.timeoutHandle = window.setTimeout(() =>
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

      animationState: AnimationState.InsertUnit,
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

      animationState: AnimationState.PushUnit,
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
      maxUnits: Math.max(ceil, minUnits),
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

      let unitAnimationState: AnimationState = AnimationState.Idle;

      switch (this.state.animationState)
      {
        case AnimationState.RemoveDeadUnit:
        {
          if (this.state.pendingDeadUnitsById[displayData.unit.id])
          {
            unitAnimationState = AnimationState.RemoveDeadUnit;
          }
          break;
        }
        case AnimationState.FillSpaceLeftByDeadUnits:
        {
          if (this.state.pendingDeadUnitIndices[i])
          {
            unitAnimationState = AnimationState.FillSpaceLeftByDeadUnits;
          }
          break;
        }
        case AnimationState.RemoveUnit:
        {
          if (i === 0)
          {
            unitAnimationState = AnimationState.RemoveUnit;
          }
          break;
        }
        case AnimationState.ClearSpaceForUnit:
        {
          if (i === this.state.insertIndex)
          {
            unitAnimationState = AnimationState.ClearSpaceForUnit;
          }
          break;
        }
        case AnimationState.InsertUnit:
        {
          if (i === this.state.insertIndex)
          {
            unitAnimationState = AnimationState.InsertUnit;
          }
          break;
        }
        case AnimationState.PushUnit:
        {
          if (i === unitsToRender - 1)
          {
            unitAnimationState = AnimationState.PushUnit;
          }
          break;
        }
      }

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
        }),
      );
    }

    if (isFinite(this.props.hoveredGhostIndex))
    {
      toRender.splice(this.props.hoveredGhostIndex, 0, React.DOM.div(
      {
        className: "turn-order-arrow",
        key: "ghost",
      }));
    }

    return(
      React.DOM.div({className: "turn-order-container"},
        toRender,
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(TurnOrderComponent);
export default Factory;
