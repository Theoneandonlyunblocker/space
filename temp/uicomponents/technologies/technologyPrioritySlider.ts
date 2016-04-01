/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../../playertechnology.ts" />
/// <reference path="../../templateinterfaces/itechnologytemplate.d.ts" />

export interface PropTypes
{
  playerTechnology: Rance.PlayerTechnology;
  technology: Rance.Templates.ITechnologyTemplate;
  researchPoints: number;
}

export default class TechnologyPrioritySlider extends React.Component<PropTypes, {}>
{
  displayName: reactTypeTODO_any = string = "TechnologyPrioritySlider";
  state:
  {
    priority: number;
  };

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      priority: this.getPlayerPriority()
    };

    this.bindMethods();
  }
  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  private bindMethods()
  {
    this.getPlayerPriority = this.getPlayerPriority.bind(this);
    this.updatePriority = this.updatePriority.bind(this);
    this.handlePriorityChange = this.handlePriorityChange.bind(this);
  }
  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  private componentDidMount()
  {
    Rance.eventManager.addEventListener("technologyPrioritiesUpdated", this.updatePriority);
  }
  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  private componentWillUnmount()
  {
    Rance.eventManager.removeEventListener("technologyPrioritiesUpdated", this.updatePriority);
  }
  private isTechnologyLocked(): boolean
  {
    return this.props.playerTechnology.technologies[this.props.technology.key].priorityIsLocked;
  }
  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  private getPlayerPriority()
  {
    return this.props.playerTechnology.technologies[this.props.technology.key].priority;
  }
  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
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
  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
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
