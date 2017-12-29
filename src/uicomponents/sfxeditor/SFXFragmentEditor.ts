import * as React from "react";

import SFXFragment from "../../../modules/common/battlesfxfunctions/sfxfragments/SFXFragment";

import SFXFragmentPropsList from "./SFXFragmentPropsList";

interface PropTypes extends React.Props<any>
{
  fragment: SFXFragment<any>;
  onActiveFragmentPropValueChange: () => void;
}

interface StateType
{
}

export class SFXFragmentEditorComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "SFXFragmentEditor";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.handleReset = this.handleReset.bind(this);
  }

  private handleReset(): void
  {
    this.props.fragment.setDefaultProps();
    this.props.onActiveFragmentPropValueChange();
  }

  render()
  {
    return(
      React.DOM.div(
      {
        className: "sfx-fragment-editor",
      },
        React.DOM.button(
        {
          className: "sfx-fragment-reset-props-button",
          onClick: this.handleReset,
        },
          "Reset",
        ),
        SFXFragmentPropsList(
        {
          fragment: this.props.fragment,
          onPropValueChange: this.props.onActiveFragmentPropValueChange,
        }),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(SFXFragmentEditorComponent);
export default Factory;
