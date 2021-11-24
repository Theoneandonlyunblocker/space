import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {MapGenOption as MapGenOptionObj} from "core/src/templateinterfaces/MapGenOption";
import
{
  clamp,
} from "core/src/generic/utility";
import { NumberInput } from "../generic/NumberInput";


export interface PropTypes extends React.Props<any>
{
  value: number;
  id: string;
  option: MapGenOptionObj;
  onChange: (optionName: string, newValue: number) => void;
}

interface StateType
{
}

export class MapGenOptionComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "MapGenOption";

  handleChange(e: React.FormEvent<HTMLInputElement>)
  {
    const target = e.currentTarget;
    const option = this.props.option;
    const newValue = clamp(parseFloat(target.value), option.range.min, option.range.max);
    this.props.onChange(this.props.id, newValue);
  }

  public override shouldComponentUpdate(newProps: PropTypes)
  {
    return newProps.value !== this.props.value;
  }

  public override state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleChange = this.handleChange.bind(this);
  }

  public override render()
  {
    const option = this.props.option;
    const range = option.range;
    const id = "mapGenOption_" + this.props.id;

    ["min", "max", "step"].forEach(prop =>
    {
      if (!range[prop])
      {
        throw new Error(`No property ${prop} specified on map gen option ${this.props.id}`);
      }
    });

    return(
      ReactDOMElements.div(
      {
        className: "map-gen-option",
      },
        ReactDOMElements.label(
        {
          className: "map-gen-option-label",
          title: option.displayName,
          htmlFor: id,
        },
          option.displayName,
        ),
        ReactDOMElements.input(
        {
          className: "map-gen-option-slider",
          id: id,
          type: "range",
          min: range.min,
          max: range.max,
          step: range.step,
          value: "" + this.props.value,
          onChange: this.handleChange,
        }),
        NumberInput(
        {
          attributes:
          {
            className: "map-gen-option-value",
            title: option.displayName,
          },
          value: this.props.value,
          min: range.min,
          max: range.max,
          step: range.step,
          canWrap: false,
          onChange: (newValue) => this.props.onChange(this.props.id, newValue),
        }),
      )
    );
  }
}

export const MapGenOption: React.Factory<PropTypes> = React.createFactory(MapGenOptionComponent);
