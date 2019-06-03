import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {FixedRateTicker} from "../../../../src/FixedRateTicker";

import
{
  clamp,
  roundToNearestMultiple,
} from "../../../../src/utility";


interface PropTypes extends React.Props<any>
{
  value: number;
  step: number;
  onChange: (value: number) => void;

  min?: number;
  max?: number;
}

interface StateType
{
}

export class SpinnerComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "Spinner";
  public state: StateType;

  private spinDirection: 1 | -1;
  private startSpinTimeoutHandle: number;

  private readonly ticker: FixedRateTicker;
  private readonly timeBetweenSpins = 50;
  private readonly spinStartDelay = 300;

  constructor(props: PropTypes)
  {
    super(props);

    this.stepUp = this.stepUp.bind(this);
    this.stepDown = this.stepDown.bind(this);
    this.startSpinUp = this.startSpinUp.bind(this);
    this.startSpinDown = this.startSpinDown.bind(this);
    this.stopSpin = this.stopSpin.bind(this);
    this.onSpinTick = this.onSpinTick.bind(this);

    this.ticker = new FixedRateTicker(this.onSpinTick, this.timeBetweenSpins);
  }

  public componentWillUnmount(): void
  {
    this.stopSpin();
  }
  public render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "spinner",
      },
        ReactDOMElements.button(
        {
          className: "spinner-arrow spinner-arrow-up",
          onClick: this.stepUp,
          onMouseDown: this.startSpinUp,
          onTouchStart: this.startSpinUp,
        }),
        ReactDOMElements.button(
        {
          className: "spinner-arrow spinner-arrow-down",
          onClick: this.stepDown,
          onMouseDown: this.startSpinDown,
          onTouchStart: this.startSpinDown,
        }),
      )
    );
  }

  private adjust(delta: number): void
  {
    const min = isFinite(this.props.min) ? this.props.min : -Infinity;
    const max = isFinite(this.props.max) ? this.props.max : Infinity;

    const newValue = clamp(
      roundToNearestMultiple(this.props.value + delta, this.props.step),
      min,
      max,
    );

    this.props.onChange(newValue);
  }
  private stepUp(): void
  {
    this.adjust(this.props.step);
  }
  private stepDown(): void
  {
    this.adjust(-this.props.step);
  }
  private startSpinUp(): void
  {
    this.spinDirection = 1;

    this.startSpin();
  }
  private startSpinDown(): void
  {
    this.spinDirection = -1;

    this.startSpin();
  }
  private startSpin(): void
  {
    document.addEventListener("mouseup", this.stopSpin);
    document.addEventListener("touchend", this.stopSpin);

    this.startSpinTimeoutHandle = window.setTimeout(() =>
    {
      this.ticker.start();
    }, this.spinStartDelay);
  }
  private stopSpin(): void
  {
    this.ticker.stop();

    if (isFinite(this.startSpinTimeoutHandle))
    {
      window.clearTimeout(this.startSpinTimeoutHandle);
    }
    this.startSpinTimeoutHandle = undefined;

    document.removeEventListener("mouseup", this.stopSpin);
    document.removeEventListener("touchend", this.stopSpin);
  }
  private onSpinTick(ticks: number): void
  {
    this.adjust(this.spinDirection * this.props.step * ticks);
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(SpinnerComponent);
export default factory;
