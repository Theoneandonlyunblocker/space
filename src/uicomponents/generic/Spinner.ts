/// <reference path="../../../lib/react-global.d.ts" />

import
{
  clamp,
} from "../../utility";

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

  constructor(props: PropTypes)
  {
    super(props);

    this.stepUp = this.stepUp.bind(this);
    this.stepDown = this.stepDown.bind(this);
  }

  public render()
  {
    return(
      React.DOM.div(
      {
        className: "spinner",
      },
        React.DOM.button(
        {
          className: "spinner-arrow spinner-arrow-up",
          onClick: this.stepUp,
        }),
        React.DOM.button(
        {
          className: "spinner-arrow spinner-arrow-down",
          onClick: this.stepDown,
        }),
      )
    );
  }

  private adjust(delta: number): void
  {
    const min = this.props.min || -Infinity;
    const max = this.props.max || Infinity;

    const newValue = clamp(this.props.value + delta, min, max);

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
}

const Factory: React.Factory<PropTypes> = React.createFactory(SpinnerComponent);
export default Factory;
