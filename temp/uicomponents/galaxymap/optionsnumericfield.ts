export interface PropTypes
{
  onChangeFN: reactTypeTODO_func; // (value: number) => void

  label: string;
  id: string;
  value: number;
  min: number;
  max: number;
  step: number;
}

export default class OptionsNumericField extends React.Component<PropTypes, {}>
{
  displayName: "OptionsNumericField",


  getInitialState: function()
  {
    return(
    {
      value: this.props.value
    });
  },

  componentWillReceiveProps: function(newProps: any)
  {
    if (newProps.value !== this.state.value)
    {
      this.setState({value: newProps.value});
    }
  },
  

  triggerOnChangeFN: function()
  {
    this.props.onChangeFN(this.state.value);
  },

  handleChange: function(e: Event)
  {
    var target = <HTMLInputElement> e.target;
    var value = parseFloat(target.value);

    if (!isFinite(value))
    {
      return;
    }

    value = clamp(value, parseFloat(target.min), parseFloat(target.max));

    this.setState(
    {
      value: value
    }, this.triggerOnChangeFN);
  },

  render: function()
  {
    var inputId = "" + this.props.id + "-input";

    return(
      React.DOM.div(
      {
        className: "options-numeric-field-container",
        id: this.props.id
      },
        React.DOM.input(
        {
          className: "options-numeric-field-input",
          type: "number",
          id: inputId,
          value: this.state.value,
          min: this.props.min,
          max: this.props.max,
          step: this.props.step,
          onChange: this.handleChange
        },
          null
        ),
        React.DOM.label(
        {
          className: "options-numeric-field-label",
          htmlFor: inputId
        },
          this.props.label
        )
      )
    );
  }
}
