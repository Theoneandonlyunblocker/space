import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import SfxFragment from "../../modules/space/battlesfx/drawingfunctions/sfxfragments/SfxFragment";

import SfxFragmentPropsList from "./SfxFragmentPropsList";


interface PropTypes extends React.Props<any>
{
  fragment: SfxFragment<any>;
  onActiveFragmentPropValueChange: () => void;
}

interface StateType
{
}

export class SfxFragmentEditorComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "SfxFragmentEditor";
  public state: StateType;

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
      ReactDOMElements.div(
      {
        className: "sfx-fragment-editor",
      },
        ReactDOMElements.button(
        {
          className: "sfx-fragment-reset-props-button",
          onClick: this.handleReset,
        },
          "Reset",
        ),
        SfxFragmentPropsList(
        {
          fragment: this.props.fragment,
          onPropValueChange: this.props.onActiveFragmentPropValueChange,
        }),
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(SfxFragmentEditorComponent);
export default factory;
