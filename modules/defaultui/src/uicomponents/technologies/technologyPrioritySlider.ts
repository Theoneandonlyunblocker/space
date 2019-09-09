import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {PlayerTechnology} from "core/src/player/PlayerTechnology";
import {eventManager} from "core/src/app/eventManager";
import {TechnologyTemplate} from "core/src/templateinterfaces/TechnologyTemplate";


export interface PropTypes extends React.Props<any>
{
  playerTechnology: PlayerTechnology;
  technology: TechnologyTemplate;
  researchPoints: number;
}

interface StateType
{
  priority: number;
}

export class TechnologyPrioritySliderComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "TechnologyPrioritySlider";
  public state: StateType;

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
      priority: this.getPlayerPriority(),
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
      priority: this.getPlayerPriority(),
    });
  }
  private handlePriorityChange(e: React.FormEvent<HTMLInputElement>)
  {
    if (this.isTechnologyLocked())
    {
      return;
    }

    const target = e.currentTarget;
    this.props.playerTechnology.setTechnologyPriority(this.props.technology, parseFloat(target.value));
  }
  public render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "technology-progress-bar-priority-container",
      },
        ReactDOMElements.span(
        {
          className: "technology-progress-bar-predicted-research",
        },
          `+${(this.props.researchPoints * this.state.priority).toFixed(1)}`,
        ),
        ReactDOMElements.input(
        {
          className: "technology-progress-bar-priority",
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
          value: "" + this.state.priority,
          onChange: this.handlePriorityChange,
          disabled: this.isTechnologyLocked(),
        }),
      )
    );
  }
}

export const TechnologyPrioritySlider: React.Factory<PropTypes> = React.createFactory(TechnologyPrioritySliderComponent);
