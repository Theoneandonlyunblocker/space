import * as React from "react";

import {introTutorial} from "core/src/tutorials/IntroTutorial";
import {tutorialStatus} from "core/src/tutorials/TutorialStatus";
import {TutorialVisibility} from "core/src/tutorials/TutorialVisibility";
import {DefaultWindow} from "../windows/DefaultWindow";

import {Tutorial} from "./Tutorial";


export interface PropTypes extends React.Props<any>
{
}

interface StateType
{
  shouldShow: boolean;
}

export class IntroTutorialComponent extends React.Component<PropTypes, StateType>
{
  public displayName: string = "IntroTutorial";
  public popupId: number = null;

  public override state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      shouldShow: tutorialStatus.introTutorial === TutorialVisibility.Show,
    };
  }

  public override render()
  {
    if (!this.state.shouldShow)
    {
      return null;
    }

    return(
      DefaultWindow(
      {
        title: "Tutorial",
        attributes:
        {
          className: "never-hide-when-user-interacts-with-map"
        },
        handleClose: () =>
        {
          this.setState({shouldShow: false});
        },
      },
        Tutorial(
        {
          pages: introTutorial.pages,
          tutorialId: "introTutorial",
        }),
      )
    );
  }
}

export const IntroTutorial: React.Factory<PropTypes> = React.createFactory(IntroTutorialComponent);
