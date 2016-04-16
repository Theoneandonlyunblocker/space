/// <reference path="../../../lib/react-0.13.3.d.ts" />


import TechnologyTemplate from "../../templateinterfaces/TechnologyTemplate";
import TechnologyPrioritySlider from "./technologyPrioritySlider";
import PlayerTechnology from "../../PlayerTechnology";



interface PropTypes extends React.Props<any>
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
    var pt = this.props.playerTechnology;
    var technology = this.props.technology;

    pt.technologies[technology.key].priorityIsLocked = !pt.technologies[technology.key].priorityIsLocked;
    this.forceUpdate();
  }
  render()
  {
    var technology = this.props.technology;
    var isAtMaxLevel: boolean = false;
    var playerTechnology = this.props.playerTechnology;
    var techData = playerTechnology.technologies[technology.key];

    var forCurrentLevel = playerTechnology.getResearchNeededForTechnologyLevel(techData.level);
    var forNextLevel = playerTechnology.getResearchNeededForTechnologyLevel(techData.level + 1);

    var progressForLevel = techData.totalResearch - forCurrentLevel;
    var neededToProgressLevel = forNextLevel - forCurrentLevel;
    var relativeProgress: number;

    if (techData.level === technology.maxLevel)
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
        className: "technology-listing"
      },
        React.DOM.div(
        {
          className: "technology-name"
        },
          technology.displayName
        ),
        React.DOM.div(
        {
          className: "technology-level"
        },
          "Level " + techData.level
        ),
        React.DOM.div(
        {
          className: "technology-progress-bar-container"
        },
          React.DOM.div(
          {
            className: "technology-progress-bar" +
              (isAtMaxLevel ? " technology-progress-bar-max-level" : ""),
            style:
            {
              width: "" + (relativeProgress * 100) + "%"
            }
          }),
          React.DOM.div(
          {
            className: "technology-progress-bar-value"
          },
            "" + progressForLevel.toFixed(1) + " / " + Math.ceil(neededToProgressLevel)
          ),
          TechnologyPrioritySlider(
          {
            playerTechnology: this.props.playerTechnology,
            technology: this.props.technology,
            researchPoints: this.props.researchPoints
          })
        ),
        React.DOM.button(
        {
          className: "technology-toggle-priority-lock" + (techData.priorityIsLocked ? " locked" : " unlocked"),
          onClick: this.togglePriorityLock,
          disabled: isAtMaxLevel
        },
          null
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(TechnologyComponent);
export default Factory;
