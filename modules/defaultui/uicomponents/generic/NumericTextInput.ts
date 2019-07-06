import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import
{
  mergeReactAttributes,
} from "../../../../src/utility";


export interface PropTypes extends React.Props<any>
{
  value: number;
  valueStringIsValid: (valueString: string) => boolean;
  getValueFromValueString: (valueString: string) => number;
  onValueChange: (value: number) => void;

  stylizeValue?: (value: number) => string;
  attributes?: React.HTMLAttributes<HTMLInputElement>;
}

interface StateType
{
  valueString: string;
}

export class NumericTextInputComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "NumericTextInput";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      valueString: NumericTextInputComponent.getValueString(this.props.value, this.props.stylizeValue),
    };

    this.handleValueChange = this.handleValueChange.bind(this);
  }

  public static getDerivedStateFromProps(props: PropTypes, state: StateType): StateType
  {
    const didChange = props.value !== props.getValueFromValueString(state.valueString);

    if (didChange)
    {
      return {valueString: NumericTextInputComponent.getValueString(props.value, props.stylizeValue)};
    }
    else
    {
      return null;
    }
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

  public render()
  {
    const valueStringIsValid = this.props.valueStringIsValid(this.state.valueString);

    const defaultAttributes: React.InputHTMLAttributes<HTMLInputElement> =
    {
      className: "numeric-text-input" +
        (valueStringIsValid ? "" : " invalid-value"),
      onChange: this.handleValueChange,
      value: this.state.valueString,
      spellCheck: false,
    };
    const customAttributes = this.props.attributes || {};
    const attributes = mergeReactAttributes(defaultAttributes, customAttributes);

    return(
      ReactDOMElements.input(attributes)
    );
  }

  private handleValueChange(e: React.FormEvent<HTMLInputElement> | React.ClipboardEvent<HTMLInputElement>): void
  {
    e.stopPropagation();
    e.preventDefault();

    const target = e.currentTarget;
    const valueString = target.value;

    this.setState(
    {
      valueString: valueString,
    }, () =>
    {
      const isValid = this.props.valueStringIsValid(valueString);
      if (isValid)
      {
        const value = this.props.getValueFromValueString(valueString);
        this.props.onValueChange(value);
      }
    });
  }
}

export const NumericTextInput: React.Factory<PropTypes> = React.createFactory(NumericTextInputComponent);
