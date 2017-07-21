import * as React from "react";

import {default as Spinner} from "./Spinner";

import
{
  clamp,
  mergeReactAttributes,
} from "../../utility";


interface PropTypes extends React.Props<any>
{
  value: number;
  onChange: (value: number) => void;

  min?: number;
  max?: number;
  step?: number;
  canWrap?: boolean;

  attributes?: React.HTMLAttributes<HTMLDivElement>;
}

interface StateType
{
  displayedValue?: string;
}

export class NumberInputComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "NumberInput";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      displayedValue: "" + this.roundValue(this.props.value),
    };

    this.handleValueChange = this.handleValueChange.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  public componentWillReceiveProps(newProps: PropTypes): void
  {
    if ("" + newProps.value !== this.state.displayedValue)
    {
      this.setState(
      {
        displayedValue: "" + this.roundValue(newProps.value),
      });
    }
  }
  public componentWillUnmount(): void
  {
    this.handleBlur();
  }
  public render()
  {
    const defaultAttributes: React.HTMLAttributes<HTMLDivElement> =
    {
      className: "number-input-container",
    };
    ;
    const customAttributes = this.props.attributes || {};
    const attributes = mergeReactAttributes(defaultAttributes, customAttributes);

    return(
      React.DOM.div(attributes,
        React.DOM.input(
        {
          className: "number-input",
          type: "text",
          value: this.state.displayedValue,
          onChange: this.handleValueChange,
          onBlur: this.handleBlur,
        }),
        Spinner(
        {
          value: this.props.value,
          step: this.getStep(),
          onChange: this.changeValue,

          min: this.props.canWrap ? -Infinity : this.props.min,
          max: this.props.canWrap ? Infinity : this.props.max,
        }),
      )
    );
  }

  private getStep(): number
  {
    return this.props.step || 1;
  }
  private getDecimalPlacesInStep(): number
  {
    // step is specified in code, so assume no precision issues
    const split = ("" + this.getStep()).split(".");

    return split[1] ? split[1].length : 0;
  }
  private roundValue(value: number): number
  {
    const precision = this.getDecimalPlacesInStep();

    return parseFloat(value.toFixed(precision));
  }
  private handleBlur(): void
  {
    if (this.valueStringIsValid(this.state.displayedValue))
    {
      this.changeValue(parseFloat(this.state.displayedValue));
    }
    else
    {
      this.setState({displayedValue: "" + this.props.value});
    }
  }
  private handleValueChange(e: React.FormEvent<HTMLInputElement> | ClipboardEvent): void
  {
    e.stopPropagation();
    e.preventDefault();

    const target = <HTMLInputElement> e.target;
    const valueString = target.value;

    const isValid = this.valueStringIsValid(valueString);
    const isWithinBounds = this.valueIsWithinBounds(parseFloat(valueString));

    if (isValid && isWithinBounds)
    {
      this.changeValue(parseFloat(valueString));
    }
    else
    {
      this.setState(
      {
        displayedValue: valueString,
      });
    }
  }
  private changeValue(value: number): void
  {
    if (value === this.props.value)
    {
      this.setState({displayedValue: "" + value});

      return;
    }

    const roundedValue = this.roundValue(value);

    const min = isFinite(this.props.min) ? this.props.min : -Infinity;
    const max = isFinite(this.props.max) ? this.props.max : Infinity;

    if (this.props.canWrap)
    {
      if (!isFinite(min) || !isFinite(max))
      {
        throw new Error(`NumberInput component with wrapping enabled must specify min and max values.`);
      }

      if (roundedValue < min)
      {
        const underMin = min - (roundedValue % max);
        this.props.onChange(max - underMin);
      }
      else
      {
        this.props.onChange(roundedValue % max);
      }
    }
    else
    {
      const clampedValue = clamp(roundedValue, min, max);
      this.props.onChange(clampedValue);
    }
  }
  private valueStringIsValid(valueString: string): boolean
  {
    // signed float
    if (!valueString.match(/^(-?(?:0|[1-9]\d*)(?:\.\d+)?)?$/))
    {
      return false;
    }

    const value = parseFloat(valueString);

    if (!isFinite(value))
    {
      return false;
    }

    return true;
  }
  private valueIsWithinBounds(value: number): boolean
  {
    const min = isFinite(this.props.min) ? this.props.min : -Infinity;
    const max = isFinite(this.props.max) ? this.props.max : Infinity;

    return value >= min && value <= max;
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(NumberInputComponent);
export default Factory;
