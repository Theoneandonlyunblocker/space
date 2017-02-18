/// <reference path="../../../lib/react-global.d.ts" />


import PlayerTechnology from "../../PlayerTechnology";
import TechnologyTemplate from "../../templateinterfaces/TechnologyTemplate";
import TechnologyPrioritySlider from "./technologyPrioritySlider";



export interface PropTypes extends React.Props<any>
{
  playerTechnology: PlayerTechnology;
  technology: TechnologyTemplate;

  researchPoints: number;
}

interface StateType
{
}

export class TechnologyComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "Technology";


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();
  }
  private bindMethods()
  {
    this.togglePriorityLock = this.togglePriorityLock.bind(this);
  }

  togglePriorityLock()
  {
    const pt = this.props.playerTechnology;
    const technology = this.props.technology;

    pt.technologies[technology.key].priorityIsLocked = !pt.technologies[technology.key].priorityIsLocked;
    this.forceUpdate();
  }
  render()
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
          className: "technology-name",
        },
          technology.displayName,
        ),
        React.DOM.div(
        {
          className: "technology-level",
        },
          "Level " + techData.level,
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
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(TechnologyComponent);
export default Factory;
