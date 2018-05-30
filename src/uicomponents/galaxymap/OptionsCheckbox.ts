import * as React from "react";


export interface PropTypes extends React.Props<any>
{
  onChangeFN: (e: React.FormEvent<HTMLInputElement>) => void;
  label: string;
  isChecked: boolean;
}

interface StateType
{
}

export class OptionsCheckboxComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "OptionsCheckbox";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    const checkboxId = "options-checkbox-" + this.props.label;

    return(
      React.DOM.div(
      {
        className: "options-checkbox-container",
      },
        React.DOM.input(
        {
          type: "checkbox",
          id: checkboxId,
          checked: this.props.isChecked,
          onChange: this.props.onChangeFN,
        }),
        React.DOM.label(
        {
          htmlFor: checkboxId,
        },
          this.props.label,
        ),
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(OptionsCheckboxComponent);
export default factory;
