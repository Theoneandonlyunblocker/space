import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";


export interface PropTypes extends React.Props<any>
{
  value: number;
  max: number;
  onChange: (value: number) => void;

  backgroundStyle: string;
}

interface StateType
{
}

export class ColorPickerSliderComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "ColorPickerSlider";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.handleChangeEvent = this.handleChangeEvent.bind(this);
  }

  public render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "color-picker-slider-background",
        style:
        {
          background: this.props.backgroundStyle,
        },
      },
        ReactDOMElements.input(
        {
          className: "color-picker-slider",
          type: "range",
          min: 0,
          max: this.props.max,
          step: 1,
          value: "" + this.props.value,
          onChange: this.handleChangeEvent,
          onMouseUp: this.handleChangeEvent,
          onTouchEnd: this.handleChangeEvent,
        }),
      )
    );
  }

  private handleChangeEvent(e: React.FormEvent<HTMLInputElement>): void
  {
    const target = e.currentTarget;
    const value = parseInt(target.value);

    this.props.onChange(value);
  }
}

export const ColorPickerSlider: React.Factory<PropTypes> = React.createFactory(ColorPickerSliderComponent);
