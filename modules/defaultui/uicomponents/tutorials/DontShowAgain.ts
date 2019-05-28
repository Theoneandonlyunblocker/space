import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import TutorialStatus from "../../tutorials/TutorialStatus";
import TutorialVisibility from "../../tutorials/TutorialVisibility";

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


  public state: StateType;

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
      ReactDOMElements.div(
      {
        className: "dont-show-again-wrapper",
      },
        ReactDOMElements.label(null,
          ReactDOMElements.input(
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

const factory: React.Factory<PropTypes> = React.createFactory(DontShowAgainComponent);
export default factory;
