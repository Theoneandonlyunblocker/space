import * as React from "react";

import TutorialVisibility from "../../tutorials/TutorialVisibility";
import TutorialStatus from "../../tutorials/TutorialStatus";

import {localize} from "../../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  tutorialId: string;
}

interface StateType
{
  isChecked: boolean;
}

export class DontShowAgainComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "DontShowAgain";


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }
  private bindMethods()
  {
    this.toggleState = this.toggleState.bind(this);
    this.getTutorialVisibility = this.getTutorialVisibility.bind(this);
  }

  private getInitialStateTODO(): StateType
  {
    return(
    {
      isChecked: this.getTutorialVisibility() === TutorialVisibility.NeverShow,
    });
  }

  getTutorialVisibility()
  {
    return TutorialStatus[this.props.tutorialId];
  }

  toggleState()
  {
    if (this.state.isChecked)
    {
      TutorialStatus[this.props.tutorialId] = TutorialVisibility.Show;
    }
    else
    {
      TutorialStatus[this.props.tutorialId] = TutorialVisibility.NeverShow;
    }

    TutorialStatus.save();

    this.setState(
    {
      isChecked: !this.state.isChecked,
    });
  }

  render()
  {
    return(
      React.DOM.div(
      {
        className: "dont-show-again-wrapper",
      },
        React.DOM.label(null,
          React.DOM.input(
          {
            type: "checkBox",
            className: "dont-show-again",
            checked: this.state.isChecked,
            onChange: this.toggleState,
          }),
          localize("dontShowAgain")(),
        ),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(DontShowAgainComponent);
export default Factory;
