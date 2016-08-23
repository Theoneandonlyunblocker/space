/// <reference path="../../../lib/react-global.d.ts" />

import SFXFragment from "../../../modules/common/battlesfxfunctions/sfxfragments/SFXFragment";
import ShockWave from "../../../modules/common/battlesfxfunctions/sfxfragments/ShockWave";

// import UnitTemplate from "../../templateinterfaces/UnitTemplate";

import SFXEditorSelection from "./SFXEditorSelection";

const availableFragments:
{
  displayName: string;
  constructorFN: (props: any) => SFXFragment<any, any>;
}[] =
[
  {
    displayName: "ShockWave",
    constructorFN: ShockWave
  }
];

interface PropTypes extends React.Props<any>
{
  // availableUnitTemplates: UnitTemplate[];
}

interface StateType
{
  currentTime?: number;
  SFXDuration?: number;

  selectedFragment?: SFXFragment<any, any>;
}

export class SFXEditorComponent extends React.Component<PropTypes, StateType>
{
  displayName = "SFXEditor";
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
        React.DOM.div(
        {
          className: "sfx-fragment-editor-main"
        },
          React.DOM.div(
          {
            className: "sfx-fragment-editor-display"
          },
            
          ),
          React.DOM.div(
          {
            className: "sfx-fragment-editor-time-control"
          },
            React.DOM.div(
            {
              className: "sfx-fragment-editor-play-wrapper"
            },
              React.DOM.div(
              {
                className: "sfx-fragment-editor-play-button"
              },
                
              ),
              React.DOM.div(
              {
                className: "sfx-fragment-editor-duration"
              },
                
              )
            )
          ),
        ),
        SFXEditorSelection(
        {
          availableFragments: availableFragments
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(SFXEditorComponent);
export default Factory;
