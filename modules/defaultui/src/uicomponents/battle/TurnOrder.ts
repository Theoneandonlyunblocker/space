import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {TurnOrderDisplayData} from "core/src/battle/TurnOrderDisplayData";
import {Unit} from "core/src/unit/Unit";

import
{
  AnimationState,
  TurnOrderUnit,
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
  transitionDuration: number;

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

  insertIndex: number | undefined;

  animationState: AnimationState;
}

export class TurnOrderComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "TurnOrder";
  public state: StateType;

  private readonly ownDOMNode = React.createRef<HTMLDivElement>();
  private timeoutHandle: number;

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
      pendingDisplayData: [],
      pendingDeadUnitsById: {},
      pendingDeadUnitIndices: {},

      insertIndex: undefined,

      animationState: AnimationState.Idle,
    });
  }
  public componentDidMount(): void
  {
    this.setMaxUnits();

    window.addEventListener("resize", this.setMaxUnits);
  }
  public componentWillUnmount(): void
  {
    window.removeEventListener("resize", this.setMaxUnits);
    if (isFinite(this.timeoutHandle))
    {
      clearTimeout(this.timeoutHandle);
    }
  }
  public componentDidUpdate(prevProps: PropTypes, prevState: StateType): void
  {
    if (this.props.turnIsTransitioning && !prevProps.turnIsTransitioning)
    {
      const removedUnit = prevState.currentDisplayData[0].unit;

      let removedUnitNewIndex: number;
      for (let i = 0; i < this.props.turnOrderDisplayData.length; i++)
      {
        if (this.props.turnOrderDisplayData[i].unit === removedUnit)
        {
          removedUnitNewIndex = i;
          break;
        }
      }

      const pendingDeadUnitsById: {[id: number]: boolean} = {};
      prevProps.turnOrderDisplayData.forEach(currentDisplayData =>
      {
        const unit = currentDisplayData.unit;
        if (!this.props.turnOrderDisplayData.some(newDisplayData =>
        {
          return newDisplayData.unit === unit;
        }))
        {
          pendingDeadUnitsById[unit.id] = true;
        }
      });

      const unitsToRender = Math.min(this.props.turnOrderDisplayData.length, prevState.maxUnits);
      const shouldInsertRemovedUnit = removedUnitNewIndex < unitsToRender - 1;

      this.setState(
      {
        pendingDisplayData: this.props.turnOrderDisplayData,
        pendingDeadUnitsById: pendingDeadUnitsById,

        insertIndex: shouldInsertRemovedUnit ? removedUnitNewIndex : undefined,
      }, () =>
      {
        this.removeDeadUnits();
      });
    }
  }

  private setFinishAnimatingTimeout()
  {
    this.timeoutHandle = setTimeout(() =>
    {
      this.setState(
      {
        animationState: AnimationState.Idle,
      });
    }, this.props.transitionDuration);
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
        this.timeoutHandle = setTimeout(() =>
        {
          this.fillSpaceLeftByDeadUnits();
        }, this.props.transitionDuration);
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
      this.timeoutHandle = setTimeout(() =>
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
      }, this.props.transitionDuration);
    });
  }
  private removeUnit()
  {
    this.setState(
    {
      animationState: AnimationState.RemoveUnit,
    }, () =>
    {
      this.timeoutHandle = setTimeout(() =>
      {
        this.setState(
        {
          currentDisplayData: this.state.currentDisplayData.slice(1),
        });

        if (this.state.insertIndex !== undefined)
        {
          this.clearSpaceForUnit();
        }
        else
        {
          this.pushUnit();
        }
      }, this.props.transitionDuration);
    });
  }
  private clearSpaceForUnit()
  {
    this.setState(
    {
      animationState: AnimationState.ClearSpaceForUnit,
    }, () =>
    {
      this.timeoutHandle = setTimeout(() =>
      {
        this.insertUnit();
      }, this.props.transitionDuration);
    });
  }
  private insertUnit()
  {
    this.setState(
    {
      currentDisplayData: this.state.pendingDisplayData,
      pendingDisplayData: [],

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
      pendingDisplayData: [],

      animationState: AnimationState.PushUnit,
    }, () =>
    {
      this.setFinishAnimatingTimeout();
    });
  }

  private setMaxUnits()
  {
    const minUnits = 7;

    const containerElement = this.ownDOMNode.current;

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
    const transitionDuration = this.props.transitionDuration;

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
          unitName: displayData.unit.name.toString(),
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
      toRender.splice(this.props.hoveredGhostIndex, 0, ReactDOMElements.div(
      {
        className: "turn-order-arrow",
        key: "ghost",
      }));
    }

    return(
      ReactDOMElements.div({className: "turn-order-container", ref: this.ownDOMNode},
        toRender,
      )
    );
  }
}

export const TurnOrder: React.Factory<PropTypes> = React.createFactory(TurnOrderComponent);
