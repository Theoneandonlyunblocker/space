import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import
{
  mergeReactAttributes,
  stringIsSignedFloat,
} from "../../../../src/utility";

import {Spinner} from "./Spinner";


export interface PropTypes extends React.Props<any>
{
  value: number;
  onChange: (value: number) => void;

  min?: number;
  max?: number;
  step?: number;
  canWrap?: boolean;

  valueStringIsValid?: (valueString: string) => boolean;
  getValueFromValueString?: (valueString: string) => number;

  noSpinner?: boolean;
  stylizeValue?: (value: number) => string;
  attributes?: React.HTMLAttributes<HTMLInputElement>;
}

interface StateType
{
  displayedValue: string;
  lastValidValue: number;
}

export class NumberInputComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "NumberInput";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    const value = NumberInputComponent.roundValue(props.value, props.step);

    this.state =
    {
      displayedValue: NumberInputComponent.getValueString(value, props),
      lastValidValue: value,
    };

    this.handleValueInput = this.handleValueInput.bind(this);
    this.setValue = this.setValue.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  public componentDidUpdate(prevProps: PropTypes, prevState: StateType): void
  {
    const value = NumberInputComponent.roundValue(this.props.value, this.props.step);

    const thereWasExternalChange = value !== prevState.lastValidValue;

    if (thereWasExternalChange)
    {
      this.setState(
      {
        displayedValue: NumberInputComponent.getValueString(value, this.props),
        lastValidValue: this.props.value,
      });
    }
  }
  public componentWillUnmount(): void
  {
    this.handleBlur();
  }
  public render()
  {
    const valueStringIsValid = NumberInputComponent.valueStringIsValid(this.state.displayedValue, this.props);

    const defaultAttributes: React.Attributes & React.InputHTMLAttributes<HTMLInputElement> =
    {
      className: "number-input-container",
    };

    const customAttributes = this.props.attributes || {};
    const attributes = mergeReactAttributes(defaultAttributes, customAttributes);

    return(
      ReactDOMElements.div(attributes,
        ReactDOMElements.input(
        {
          className: "number-input" + (valueStringIsValid ? "" : " invalid-value"),
          type: "text",
          value: this.state.displayedValue,
          spellCheck: false,
          onChange: this.handleValueInput,
          onBlur: this.handleBlur,
        }),
        this.props.noSpinner ? null : Spinner(
        {
          value: this.props.value,
          step: this.props.step,
          onChange: this.setValue,

          min: this.props.canWrap ? -Infinity : this.props.min,
          max: this.props.canWrap ? Infinity : this.props.max,
        }),
      )
    );
  }

  private handleBlur(): void
  {
    const isValid = NumberInputComponent.valueStringIsValid(this.state.displayedValue, this.props);

    if (isValid)
    {
      const value = NumberInputComponent.getValueFromValueString(this.state.displayedValue, this.props);
      if (value !== this.state.lastValidValue)
      {
        this.setValue(value);
      }
    }
    else
    {
      this.setState(
      {
        displayedValue: NumberInputComponent.getValueString(this.props.value, this.props),
      });
    }
  }
  private handleValueInput(e: React.FormEvent<HTMLInputElement> | React.ClipboardEvent<HTMLInputElement>): void
  {
    e.stopPropagation();
    e.preventDefault();

    const target = e.currentTarget;
    const valueString = target.value;

    const value = NumberInputComponent.getValueFromValueString(valueString, this.props);

    const isValid = NumberInputComponent.valueStringIsValid(valueString, this.props);

    this.setState(
    {
      displayedValue: valueString,
      lastValidValue: isValid ? value : this.state.lastValidValue,
    }, () =>
    {
      if (isValid)
      {
        this.setValue(value);
      }
    });
  }
  private setValue(rawValue: number): void
  {
    let value = NumberInputComponent.roundValue(rawValue, this.props.step);

    if (this.props.canWrap)
    {
      value = NumberInputComponent.getValueWithWrap(value, this.props.min, this.props.max);
    }

    this.props.onChange(value);
  }

  private static getValueString(
    value: number,
    props: PropTypes,
  ): string
  {
    if (props.stylizeValue)
    {
      return props.stylizeValue(value);
    }
    else
    {
      return "" + value;
    }
  }
  private static getValueFromValueString(
    valueString: string,
    props: PropTypes,
  ): number
  {
    if (props.getValueFromValueString)
    {
      return props.getValueFromValueString(valueString);
    }
    else
    {
      return parseFloat(valueString);
    }
  }
  private static roundValue(value: number, step: number | undefined): number
  {
    if (!step)
    {
      return value;
    }
    else
    {
      const precision = NumberInputComponent.getDecimalPlacesInStep(step);

      return parseFloat(value.toFixed(precision));
    }
  }
  private static valueStringIsValid(
    valueString: string,
    props: PropTypes,
  ): boolean
  {
    if (props.valueStringIsValid)
    {
      if (!props.valueStringIsValid(valueString))
      {
        return false;
      }
    }
    else
    {
      if (!stringIsSignedFloat(valueString))
      {
        return false;
      }
    }

    const value = NumberInputComponent.getValueFromValueString(valueString, props);

    return NumberInputComponent.valueIsWithinBounds(value, props);
  }
  private static valueIsWithinBounds(
    value: number,
    props: PropTypes,
  ): boolean
  {
    const min = isFinite(props.min) ? props.min : -Infinity;
    const max = isFinite(props.max) ? props.max : Infinity;

    return value >= min && value <= max;
  }
  private static getDecimalPlacesInStep(step: number): number
  {
    // step is specified in code, so assume no precision issues
    const split = `${step}`.split(".");

    return split[1] ? split[1].length : 0;
  }
  private static getValueWithWrap(value: number, min: number, max: number): number
  {
    if (!isFinite(min) || !isFinite(max))
    {
      throw new Error("NumberInput component with wrapping enabled must specify min and max values.");
    }

    if (value < min)
    {
      const underMin = min - (value % max);

      return max - underMin;
    }
    else
    {
      return value % max;
    }
  }
}

export const NumberInput: React.Factory<PropTypes> = React.createFactory(NumberInputComponent);
