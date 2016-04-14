/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

import TutorialStateTODO from "../../tutorials/TutorialState";
import TutorialStatus from "../../tutorials/TutorialStatus";

interface PropTypes extends React.Props<any>
{
  tutorialId: string;
}

interface StateType
{
  isChecked?: boolean;
}

export class DontShowAgainComponent extends React.Component<PropTypes, StateType>
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
    this.toggleState = this.toggleState.bind(this);
    this.getTutorialState = this.getTutorialState.bind(this);    
  }
  
  private getInitialState(): StateType
  {
    return(
    {
      isChecked: this.getTutorialState() === TutorialStateTODO.neverShow
    });
  }
  
  getTutorialState()
  {
    return TutorialStatus[this.props.tutorialId];
  }

  toggleState()
  {
    if (this.state.isChecked)
    {
      TutorialStatus[this.props.tutorialId] = TutorialStateTODO.show;
    }
    else
    {
      TutorialStatus[this.props.tutorialId] = TutorialStateTODO.neverShow;
    }

    TutorialStatus.save();

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

const Factory: React.Factory<PropTypes> = React.createFactory(DontShowAgainComponent);
export default Factory;
