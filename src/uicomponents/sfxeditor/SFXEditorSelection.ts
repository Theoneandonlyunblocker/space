/// <reference path="../../../lib/react-global.d.ts" />

import SFXFragment from "../../../modules/common/battlesfxfunctions/sfxfragments/SFXFragment";

interface PropTypes extends React.Props<any>
{
  availableFragments:
  {
    displayName: string;
    constructorFN: SFXFragment<any, any>;
  }[];
}

interface StateType
{
  activeTab?: "sfx" | "units" | "fragments";
}

export class SFXEditorSelectionComponent extends React.Component<PropTypes, StateType>
{
  displayName = "SFXEditorSelection";
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
        className: "sfx-fragment-editor-selection"
      },
        
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(SFXEditorSelectionComponent);
export default Factory;
