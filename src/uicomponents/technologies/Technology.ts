import * as React from "react";

import {DefaultWindow} from "../windows/DefaultWindow";

import PlayerTechnology from "../../PlayerTechnology";

import TechnologyTemplate from "../../templateinterfaces/TechnologyTemplate";

import {TechnologyUnlocks} from "./TechnologyUnlocks";
import TechnologyPrioritySlider from "./technologyPrioritySlider";

import {localize} from "../../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  playerTechnology: PlayerTechnology;
  technology: TechnologyTemplate;

  researchPoints: number;
}

interface StateType
{
  hasUnlocksPopup?: boolean;
}

export class TechnologyComponent extends React.Component<PropTypes, StateType>
{
  public displayName: string = "Technology";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      hasUnlocksPopup: false,
    };

    this.togglePriorityLock = this.togglePriorityLock.bind(this);
    this.toggleUnlocksPopup = this.toggleUnlocksPopup.bind(this);
    this.openUnlocksPopup = this.openUnlocksPopup.bind(this);
    this.closeUnlocksPopup = this.closeUnlocksPopup.bind(this);
  }

  public render()
  {
    const technology = this.props.technology;
    let isAtMaxLevel: boolean = false;
    const playerTechnology = this.props.playerTechnology;
    const techData = playerTechnology.technologies[technology.key];

    const forCurrentLevel = playerTechnology.getResearchNeededForTechnologyLevel(techData.level);
    const forNextLevel = playerTechnology.getResearchNeededForTechnologyLevel(techData.level + 1);

    let progressForLevel = techData.totalResearch - forCurrentLevel;
    let neededToProgressLevel = forNextLevel - forCurrentLevel;
    let relativeProgress: number;

    if (techData.level === techData.maxLevel)
    {
      relativeProgress = 1;
      progressForLevel =
        techData.totalResearch - playerTechnology.getResearchNeededForTechnologyLevel(techData.level - 1);
      neededToProgressLevel = progressForLevel;
      isAtMaxLevel = true;
    }
    else
    {
      relativeProgress = progressForLevel / neededToProgressLevel;
    }

    return(
      React.DOM.div(
      {
        className: "technology-listing",
      },
        React.DOM.div(
        {
          className: "technology-listing-label",
          onClick: this.toggleUnlocksPopup,
        },
          React.DOM.div(
          {
            className: "technology-name",
            title: technology.displayName,
          },
            technology.displayName,
          ),
          React.DOM.div(
          {
            className: "technology-level",
          },
            React.DOM.span(
            {
              className: "technology-level-title",
            },
              localize("technologyLevel") + " ",
            ),
            React.DOM.span(
            {
              className: "technology-level-amount",
            },
              techData.level,
            ),
          ),
        ),
        React.DOM.div(
        {
          className: "technology-progress-bar-container",
        },
          React.DOM.div(
          {
            className: "technology-progress-bar" +
              (isAtMaxLevel ? " technology-progress-bar-max-level" : ""),
            style:
            {
              width: "" + (relativeProgress * 100) + "%",
            },
          }),
          React.DOM.div(
          {
            className: "technology-progress-bar-value",
          },
            "" + progressForLevel.toFixed(1) + " / " + Math.ceil(neededToProgressLevel),
          ),
          TechnologyPrioritySlider(
          {
            playerTechnology: this.props.playerTechnology,
            technology: this.props.technology,
            researchPoints: this.props.researchPoints,
          }),
        ),
        React.DOM.button(
        {
          className: "technology-toggle-priority-lock" + (techData.priorityIsLocked ? " locked" : " unlocked"),
          onClick: this.togglePriorityLock,
          disabled: isAtMaxLevel,
        },
          null,
        ),
        !this.state.hasUnlocksPopup ? null :
        DefaultWindow(
        {
          key: `technologyUnlocks ${this.props.technology.key}`,

          title: `${this.props.technology.displayName} ${localize("technologyUnlocks_present")}`,
          handleClose: this.closeUnlocksPopup,
        },
          TechnologyUnlocks(
          {
            technologyDisplayName: this.props.technology.displayName,
            unlocksPerLevel: this.props.technology.unlocksPerLevel,
          }),
        ),
      )
    );
  }

  private togglePriorityLock(): void
  {
    const pt = this.props.playerTechnology;
    const technology = this.props.technology;

    pt.technologies[technology.key].priorityIsLocked = !pt.technologies[technology.key].priorityIsLocked;
    this.forceUpdate();
  }
  private toggleUnlocksPopup(): void
  {
    if (this.state.hasUnlocksPopup)
    {
      this.closeUnlocksPopup();
    }
    else
    {
      this.openUnlocksPopup();
    }
  }
  private openUnlocksPopup(): void
  {
    this.setState({hasUnlocksPopup: true});
  }
  private closeUnlocksPopup(): void
  {
    this.setState({hasUnlocksPopup: false});
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(TechnologyComponent);
export default Factory;
