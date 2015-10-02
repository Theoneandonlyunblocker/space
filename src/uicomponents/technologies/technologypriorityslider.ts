module Rance
{
  export module UIComponents
  {
    export var TechnologyPrioritySlider = React.createClass(
    {
      displayName: "TechnologyPrioritySlider",
      getInitialState: function()
      {
        return(
        {
          priority: this.getPlayerPriority()
        });
      },
      componentDidMount: function()
      {
        eventManager.addEventListener("technologyPrioritiesUpdated", this.updatePriority);
      },
      componentWillUnmount: function()
      {
        eventManager.removeEventListener("technologyPrioritiesUpdated", this.updatePriority);
      },
      getPlayerPriority: function()
      {
        return this.props.player.technologies[this.props.technology.key].priority;
      },
      updatePriority: function()
      {
        this.setState(
        {
          priority: this.getPlayerPriority()
        });
      },
      handlePriorityChange: function(e: Event)
      {
        if (this.props.player.technologies[this.props.technology.key].priorityIsLocked)
        {
          return;
        }
        var target = <HTMLInputElement> e.target;
        this.props.player.setTechnologyPriority(this.props.technology, parseFloat(target.value));
      },
      render: function()
      {
        var predictedResearchPoints: number = 30; // TODO
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
              value: this.state.priority,
              onChange: this.handlePriorityChange
            })
          )
        );
      }
    })
  }
}
