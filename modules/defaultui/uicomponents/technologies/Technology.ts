import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import PlayerTechnology from "../../../../src/PlayerTechnology";
import TechnologyTemplate from "../../../../src/templateinterfaces/TechnologyTemplate";
import {DefaultWindow} from "../windows/DefaultWindow";

import {TechnologyUnlocks} from "./TechnologyUnlocks";
import TechnologyPrioritySlider from "./technologyPrioritySlider";
import { activeModuleData } from "../../../../src/activeModuleData";


export interface PropTypes extends React.Props<any>
{
  playerTechnology: PlayerTechnology;
  technology: TechnologyTemplate;

  researchPoints: number;
}

interface StateType
{
  hasUnlocksPopup: boolean;
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
      ReactDOMElements.div(
      {
        className: "technology-listing",
      },
        ReactDOMElements.div(
        {
          className: "technology-listing-label",
          onClick: this.toggleUnlocksPopup,
        },
          ReactDOMElements.div(
          {
            className: "technology-name",
            title: technology.displayName,
          },
            technology.displayName,
          ),
          ReactDOMElements.div(
          {
            className: "technology-level",
          },
            localize("technologyLevel")(techData.level),
          ),
        ),
        ReactDOMElements.div(
        {
          className: "technology-progress-bar-container",
        },
          ReactDOMElements.div(
          {
            className: "technology-progress-bar" +
              (isAtMaxLevel ? " technology-progress-bar-max-level" : ""),
            style:
            {
              width: "" + (relativeProgress * 100) + "%",
            },
          }),
          ReactDOMElements.div(
          {
            className: "technology-progress-bar-value",
          },
            `${progressForLevel.toFixed(1)} / ${Math.ceil(neededToProgressLevel)}`,
          ),
          TechnologyPrioritySlider(
          {
            playerTechnology: this.props.playerTechnology,
            technology: this.props.technology,
            researchPoints: this.props.researchPoints,
          }),
        ),
        ReactDOMElements.button(
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

          title: localize("technologyUnlocks")(
          {
            technologyName: this.props.technology.displayName,
          }),
          handleClose: this.closeUnlocksPopup,
          isResizable: false,
        },
          TechnologyUnlocks(
          {
            technologyDisplayName: this.props.technology.displayName,
            unlocksPerLevel: activeModuleData.technologyUnlocks[this.props.technology.key],
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

const factory: React.Factory<PropTypes> = React.createFactory(TechnologyComponent);
export default factory;
