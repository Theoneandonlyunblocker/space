import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import
{
  clamp,
  mergeReactAttributes,
} from "../../../../src/utility";

import {default as Spinner} from "./Spinner";


interface PropTypes extends React.Props<any>
{
  value: number;
  onChange: (value: number) => void;

  min?: number;
  max?: number;
  step: number;
  canWrap?: boolean;

  attributes?: React.HTMLAttributes<HTMLDivElement>;
}

interface StateType
{
  displayedValue: string;
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
      displayedValue: "" + NumberInputComponent.roundValue(this.props.value, this.props.step),
    };

    this.handleValueChange = this.handleValueChange.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  public static getDerivedStateFromProps(props: PropTypes): StateType
  {
    return(
    {
      displayedValue: "" + NumberInputComponent.roundValue(props.value, props.step),
    });
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

    const customAttributes = this.props.attributes || {};
    const attributes = mergeReactAttributes(defaultAttributes, customAttributes);

    return(
      ReactDOMElements.div(attributes,
        ReactDOMElements.input(
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
          step: this.props.step,
          onChange: this.changeValue,

          min: this.props.canWrap ? -Infinity : this.props.min,
          max: this.props.canWrap ? Infinity : this.props.max,
        }),
      )
    );
  }

  private static getDecimalPlacesInStep(step: number): number
  {
    // step is specified in code, so assume no precision issues
    const split = `${step}`.split(".");

    return split[1] ? split[1].length : 0;
  }
  private static roundValue(value: number, step: number): number
  {
    const precision = NumberInputComponent.getDecimalPlacesInStep(step);

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
  private handleValueChange(e: React.FormEvent<HTMLInputElement> | React.ClipboardEvent<HTMLInputElement>): void
  {
    e.stopPropagation();
    e.preventDefault();

    const target = e.currentTarget;
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

    const roundedValue = NumberInputComponent.roundValue(value, this.props.step);

    const min = isFinite(this.props.min) ? this.props.min : -Infinity;
    const max = isFinite(this.props.max) ? this.props.max : Infinity;

    if (this.props.canWrap)
    {
      if (!isFinite(min) || !isFinite(max))
      {
        throw new Error("NumberInput component with wrapping enabled must specify min and max values.");
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

const factory: React.Factory<PropTypes> = React.createFactory(NumberInputComponent);
export default factory;
