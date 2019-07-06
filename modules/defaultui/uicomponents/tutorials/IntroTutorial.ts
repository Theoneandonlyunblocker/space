import * as React from "react";

import {introTutorial} from "../../../../src/tutorials/IntroTutorial";
import {TutorialStatus} from "../../../../src/tutorials/TutorialStatus";
import {TutorialVisibility} from "../../../../src/tutorials/TutorialVisibility";
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

  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      shouldShow: TutorialStatus.introTutorial === TutorialVisibility.Show,
    };
  }

  public render()
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
