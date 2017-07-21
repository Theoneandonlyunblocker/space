import * as React from "react";

import IntroTutorial from "../../tutorials/IntroTutorial";
import TutorialState from "../../tutorials/TutorialState";
import TutorialStatus from "../../tutorials/TutorialStatus";
import {default as DefaultWindow} from "../windows/DefaultWindow";
import Tutorial from "./Tutorial";


export interface PropTypes extends React.Props<any>
{
}

interface StateType
{
  shouldShow?: boolean;
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
      shouldShow: TutorialStatus.introTutorial === TutorialState.show,
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
        minWidth: 300,
        minHeight: 250,
      },
        Tutorial(
        {
          pages: IntroTutorial.pages,
          tutorialId: "introTutorial",
        }),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(IntroTutorialComponent);
export default Factory;
