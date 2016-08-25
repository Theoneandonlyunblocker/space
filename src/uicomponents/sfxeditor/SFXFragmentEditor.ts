/// <reference path="../../../lib/react-global.d.ts" />

import SFXFragment from "../../../modules/common/battlesfxfunctions/sfxfragments/SFXFragment";

import SFXFragmentPropsList from "./SFXFragmentPropsList";

interface PropTypes extends React.Props<any>
{
  fragment: SFXFragment<any, any>;
  onActiveFragmentPropValueChange: () => void;
}

interface StateType
{
}

export class SFXFragmentEditorComponent extends React.Component<PropTypes, StateType>
{
  displayName = "SFXFragmentEditor";
  state: StateType;
  
  constructor(props: PropTypes)
  {
    super(props);
  }
  
  render()
  {
    return(
      React.DOM.div(
      {
        className: "sfx-fragment-editor"
      },
        SFXFragmentPropsList(
        {
          fragment: this.props.fragment,
          onPropValueChange: this.props.onActiveFragmentPropValueChange
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(SFXFragmentEditorComponent);
export default Factory;
