/// <reference path="../../playertechnology.ts" />

module Rance
{
  export module UIComponents
  {
    export var TechnologyPrioritySlider = React.createClass(
    {
      displayName: "TechnologyPrioritySlider",

      propTypes:
      {
        playerTechnology: React.PropTypes.instanceOf(Rance.PlayerTechnology).isRequired,
        technology: React.PropTypes.object.isRequired, // Templates.ITechnologyTemplate
        researchPoints: React.PropTypes.number.isRequired
      },

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
        return this.props.playerTechnology.technologies[this.props.technology.key].priority;
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
        if (this.props.playerTechnology.technologies[this.props.technology.key].priorityIsLocked)
        {
          return;
        }
        var target = <HTMLInputElement> e.target;
        this.props.playerTechnology.setTechnologyPriority(this.props.technology, parseFloat(target.value));
      },
      render: function()
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
              value: this.state.priority,
              onChange: this.handlePriorityChange,
              disabled: this.props.technology.priorityIsLocked
            })
          )
        );
      }
    })
  }
}
