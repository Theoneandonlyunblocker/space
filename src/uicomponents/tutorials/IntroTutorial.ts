import * as React from "react";

import introTutorial from "../../tutorials/IntroTutorial";
import TutorialStatus from "../../tutorials/TutorialStatus";
import TutorialVisibility from "../../tutorials/TutorialVisibility";
import {default as DefaultWindow} from "../windows/DefaultWindow";

import Tutorial from "./Tutorial";


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

const factory: React.Factory<PropTypes> = React.createFactory(IntroTutorialComponent);
export default factory;
