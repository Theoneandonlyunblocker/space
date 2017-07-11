/// <reference path="../../../lib/react-global.d.ts" />

import {default as Spinner} from "./Spinner";

import
{
  mergeReactAttributes,
} from "../../utility";


interface PropTypes extends React.Props<any>
{
  value: number;
  onChange: (value: number) => void;

  min?: number;
  max?: number;
  suggestedStep?: number;
  strictStep?: number;

  attributes?: React.HTMLAttributes;
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
      displayedValue: "" + this.props.value,
    };

    this.handleValueChange = this.handleValueChange.bind(this);
    this.changeValue = this.changeValue.bind(this);
  }

  public componentWillReceiveProps(newProps: PropTypes): void
  {
    if ("" + newProps.value !== this.state.displayedValue)
    {
      this.setState(
      {
        displayedValue: "" + newProps.value,
      });
    }
  }
  public render()
  {
    const defaultAttributes: React.HTMLAttributes =
    {
      className: "number-input",
      type: "text",
      value: this.state.displayedValue,
      onChange: this.handleValueChange,
      onBlur: () =>
      {
        this.setState({displayedValue: "" + this.props.value});
      },
    };
    const customAttributes = this.props.attributes || {};
    const attributes = mergeReactAttributes(defaultAttributes, customAttributes);

    return(
      React.DOM.div(
      {
        className: "number-input-container",
      },
        React.DOM.input(attributes),
        Spinner(
        {
          value: this.props.value,
          step: this.getStep(),
          onChange: this.changeValue,

          min: this.props.min,
          max: this.props.max,
        }),
      )
    );
  }

  private getStep(): number
  {
    return this.props.strictStep || this.props.suggestedStep || 1;
  }
  private getDecimalPlacesInStep(): number
  {
    // step is specified in code, so assume no precision issues
    const split = ("" + this.getStep()).split(".");

    return split[1] ? split[1].length : 0;
  }
  private handleValueChange(e: React.FormEvent | ClipboardEvent): void
  {
    e.stopPropagation();
    e.preventDefault();

    const target = <HTMLInputElement> e.target;
    const valueString = target.value;


    this.setState(
    {
      displayedValue: valueString,
    }, () =>
    {
      if (this.valueStringIsValid(valueString))
      {
        this.changeValue(parseFloat(valueString));
      }
    });
  }
  private changeValue(value: number): void
  {
    const precision = 1 + this.getDecimalPlacesInStep();
    const roundedValue = parseFloat(value.toPrecision(precision));

    this.props.onChange(roundedValue);
  }
  private valueStringIsValid(valueString: string): boolean
  {
    // TODO 2017.07.11 | VVV not true anymore
    // valueString comes from a number input, so assume it's always a valid number
    const value = parseFloat(valueString);

    if (!isFinite(value))
    {
      return false;
    }

    const min = this.props.min || -Infinity;
    const max = this.props.max || Infinity;
    if (value < min || value > max)
    {
      return false;
    }

    if (this.props.strictStep && value % this.props.strictStep !== 0)
    {
      return false;
    }

    return true;
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(NumberInputComponent);
export default Factory;
