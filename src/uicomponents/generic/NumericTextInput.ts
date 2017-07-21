import * as React from "react";

import
{
  mergeReactAttributes,
} from "../../utility";

interface PropTypes extends React.Props<any>
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
  valueString?: string;
}

export class NumericTextInputComponent extends React.Component<PropTypes, StateType>
{
  displayName = "NumericTextInput";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      valueString: this.getValueString(this.props.value),
    };

    this.handleValueChange = this.handleValueChange.bind(this);
    this.getValueString = this.getValueString.bind(this);
  }

  public componentWillReceiveProps(newProps: PropTypes): void
  {
    const didChange = newProps.value !== this.props.getValueFromValueString(this.state.valueString);
    if (didChange)
    {
      this.setState(
      {
        valueString: this.getValueString(newProps.value),
      });
    }
  }
  public render()
  {
    const valueStringIsValid = this.props.valueStringIsValid(this.state.valueString);

    const defaultAttributes: React.HTMLAttributes<HTMLInputElement> =
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
      React.DOM.input(attributes)
    );
  }

  private getValueString(value: number): string
  {
    if (this.props.stylizeValue)
    {
      return this.props.stylizeValue(value);
    }
    else
    {
      return "" + value;
    }
  }
  private handleValueChange(e: React.FormEvent<HTMLInputElement> | ClipboardEvent): void
  {
    e.stopPropagation();
    e.preventDefault();

    const target = <HTMLInputElement> e.target;

    let valueString: string;
    if (e.type === "paste")
    {
      const e2 = <ClipboardEvent> e;
      valueString = e2.clipboardData.getData("text");
    }
    else
    {
      valueString = target.value;
    }

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

const Factory: React.Factory<PropTypes> = React.createFactory(NumericTextInputComponent);
export default Factory;
