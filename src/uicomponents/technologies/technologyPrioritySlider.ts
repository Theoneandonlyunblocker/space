/// <reference path="../../../lib/react-global.d.ts" />

import TechnologyTemplate from "../../templateinterfaces/TechnologyTemplate";
import PlayerTechnology from "../../PlayerTechnology";
import eventManager from "../../eventManager";


export interface PropTypes extends React.Props<any>
{
  playerTechnology: PlayerTechnology;
  technology: TechnologyTemplate;
  researchPoints: number;
}

interface StateType
{
  priority?: number;
}

export class TechnologyPrioritySliderComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "TechnologyPrioritySlider";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }

  private bindMethods()
  {
    this.getPlayerPriority = this.getPlayerPriority.bind(this);
    this.updatePriority = this.updatePriority.bind(this);
    this.handlePriorityChange = this.handlePriorityChange.bind(this);
  }
  private getInitialStateTODO(): StateType
  {
    return(
    {
      priority: this.getPlayerPriority()
    });
  }
  componentDidMount()
  {
    eventManager.addEventListener("technologyPrioritiesUpdated", this.updatePriority);
  }
  componentWillUnmount()
  {
    eventManager.removeEventListener("technologyPrioritiesUpdated", this.updatePriority);
  }
  private isTechnologyLocked(): boolean
  {
    return this.props.playerTechnology.technologies[this.props.technology.key].priorityIsLocked;
  }
  private getPlayerPriority()
  {
    return this.props.playerTechnology.technologies[this.props.technology.key].priority;
  }
  private updatePriority()
  {
    this.setState(
    {
      priority: this.getPlayerPriority()
    });
  }
  private handlePriorityChange(e: React.FormEvent)
  {
    if (this.isTechnologyLocked())
    {
      return;
    }

    var target = <HTMLInputElement> e.target;
    this.props.playerTechnology.setTechnologyPriority(this.props.technology, parseFloat(target.value));
  }
  public render()
  {
    return(
      React.DOM.div(
      {
        className: "technology-progress-bar-priority-container"
      },
        React.DOM.span(
        {
          className: "technology-progress-bar-predicted-research"
        },
          "+" + (this.props.researchPoints * this.state.priority).toFixed(1)
        ),
        React.DOM.input(
        {
          className: "technology-progress-bar-priority",
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
          value: "" + this.state.priority,
          onChange: this.handlePriorityChange,
          disabled: this.isTechnologyLocked()
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(TechnologyPrioritySliderComponent);
export default Factory;
