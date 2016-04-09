/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../../tutorials/tutorialstatus.ts" />

export interface PropTypes
{
  tutorialId: string;
}

interface StateType
{
  // TODO refactor | add state type
}

class DontShowAgain extends React.Component<PropTypes, StateType>
{
  displayName: string = "DontShowAgain";


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  private getInitialState(): StateType
  {
    return(
    {
      isChecked: this.getTutorialState() === tutorialStatus.neverShow
    });
  }
  
  getTutorialState()
  {
    return TutorialState[this.props.tutorialId];
  }

  toggleState()
  {
    if (this.state.isChecked)
    {
      TutorialState[this.props.tutorialId] = tutorialStatus.show;
    }
    else
    {
      TutorialState[this.props.tutorialId] = tutorialStatus.neverShow;
    }

    saveTutorialState();

    this.setState(
    {
      isChecked: !this.state.isChecked
    });
  }

  render()
  {
    return(
      React.DOM.div(
      {
        className: "dont-show-again-wrapper"
      },
        React.DOM.label(null,
          React.DOM.input(
          {
            type: "checkBox",
            ref: "dontShowAgain",
            className: "dont-show-again",
            checked: this.state.isChecked,
            onChange: this.toggleState
          }),
          "Don't show again"
        )
      )
    );
  }
}
