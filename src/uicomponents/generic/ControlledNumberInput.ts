/// <reference path="../../../lib/react-global.d.ts" />

interface PropTypes extends React.Props<any>
{
  value: number;
  valueStringIsValid: (valueString: string) => boolean;
  getValueFromValueString: (valueString: string) => number;
  onValueChange: (value: number) => void;
  
  stylizeValue?: (value: number) => string;
  className?: string;
}

interface StateType
{
  valueString?: string;
}

export class ControlledNumberInputComponent extends React.Component<PropTypes, StateType>
{
  displayName = "ControlledNumberInput";
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

  componentWillReceiveProps(newProps: PropTypes): void
  {
    const didChange = newProps.value !== this.props.getValueFromValueString(this.state.valueString);
    if (didChange)
    {
      this.setState(
      {
        valueString: this.getValueString(newProps.value)
      });
    }
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

  private handleValueChange(e: React.FormEvent | ClipboardEvent): void
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
      valueString: valueString
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
  
  render()
  {
    const valueStringIsValid = this.props.valueStringIsValid(this.state.valueString);

    return(
      React.DOM.input(
      {
        className: "controlled-number-input" +
          (valueStringIsValid ? "" : " invalid-value") +
          (this.props.className ? " " + this.props.className : ""),
        onChange: this.handleValueChange,
        value: this.state.valueString,
        spellCheck: false,
      },
        null
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(ControlledNumberInputComponent);
export default Factory;
