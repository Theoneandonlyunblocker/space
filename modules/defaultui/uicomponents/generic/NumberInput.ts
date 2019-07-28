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
      displayedValue: NumberInputComponent.getValueString(value, props.stylizeValue),
      lastValidValue: value,
    };

    this.handleValueInput = this.handleValueInput.bind(this);
    this.handleSetValue = this.handleSetValue.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  public static getDerivedStateFromProps(props: PropTypes, state: StateType): StateType
  {
    const thereWasExternalChange = props.value !== state.lastValidValue;

    const value = NumberInputComponent.roundValue(props.value, props.step);

    if (thereWasExternalChange)
    {
      return(
      {
        displayedValue: NumberInputComponent.getValueString(value, props.stylizeValue),
        lastValidValue: value,
      });
    }
    else
    {
      return null;
    }
  }

  public componentWillUnmount(): void
  {
    this.handleBlur();
  }
  public render()
  {
    const valueStringIsValid = NumberInputComponent.valueStringIsValid(
      this.state.displayedValue,
      this.props.valueStringIsValid,
    );

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
          onChange: this.handleSetValue,

          min: this.props.canWrap ? -Infinity : this.props.min,
          max: this.props.canWrap ? Infinity : this.props.max,
        }),
      )
    );
  }

  private handleBlur(): void
  {
    // TODO 2019.07.29 | implement
  }
  private handleValueInput(e: React.FormEvent<HTMLInputElement> | React.ClipboardEvent<HTMLInputElement>): void
  {
    e.stopPropagation();
    e.preventDefault();

    const target = e.currentTarget;
    const valueString = target.value;

    const value = NumberInputComponent.getValueFromValueString(valueString, this.props.getValueFromValueString);

    const isWithinBounds = NumberInputComponent.valueIsWithinBounds(value, this.props.min, this.props.max);
    const isValid = isWithinBounds &&
      NumberInputComponent.valueStringIsValid(valueString, this.props.valueStringIsValid);

    this.setState(
    {
      displayedValue: valueString,
      lastValidValue: isValid ? value : this.state.lastValidValue,
    }, () =>
    {
      if (isValid)
      {
        this.handleSetValue(value);
      }
    });
  }
  private handleSetValue(rawValue: number): void
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
    stylizeFN: ((value: number) => string) | undefined,
  ): string
  {
    if (stylizeFN)
    {
      return stylizeFN(value);
    }
    else
    {
      return "" + value;
    }
  }
  private static getValueFromValueString(
    valueString: string,
    extractorFN: ((valueString: string) => number) | undefined,
  ): number
  {
    if (extractorFN)
    {
      return extractorFN(valueString);
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
    validityFN: (valueString: string) => boolean | undefined,
  ): boolean
  {
    if (validityFN)
    {
      return validityFN(valueString);
    }
    else
    {
      return stringIsSignedFloat(valueString);
    }
  }
  private static valueIsWithinBounds(
    value: number,
    min: number = Infinity,
    max: number = Infinity,
  ): boolean
  {
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
