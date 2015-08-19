/// <reference path="../../../data/mapgen/mapgentemplate.ts" />
/// <reference path="mapgenoptions.ts" />

module Rance
{
  export module UIComponents
  {
    export var MapSetup = React.createClass(
    {
      displayName: "MapSetup",

      getInitialState: function()
      {
        var mapGenTemplates: Templates.IMapGenTemplate[] = [];

        for (var template in Templates.MapGen)
        {
          if (Templates.MapGen[template].key)
          {
            mapGenTemplates.push(Templates.MapGen[template]);
          }
        }


        return(
        {
          templates: mapGenTemplates,
          selectedTemplate: mapGenTemplates[0]
        });
      },

      componentDidMount: function()
      {
        this.updatePlayerLimits();
      },

      updatePlayerLimits: function()
      {
        this.props.setPlayerLimits(
        {
          min: this.state.selectedTemplate.minPlayers,
          max: this.state.selectedTemplate.maxPlayers
        });
      },

      setTemplate: function(e)
      {
        this.setState(
        {
          selectedTemplate: Templates.MapGen[e.target.value]
        }, this.updatePlayerLimits);
      },
      
      render: function()
      {
        var mapGenTemplateOptions = [];
        for (var i = 0; i < this.state.templates.length; i++)
        {
          var template = this.state.templates[i];

          mapGenTemplateOptions.push(
            React.DOM.option(
              {
                value: template.key,
                key: template.key,
                title: template.description
              },
              template.displayName
            )
          );
        }

        return(
          React.DOM.div(
          {
            className: "map-setup"
          },
            React.DOM.select(
            {
              className: "map-setup-template-selector",
              value: this.state.selectedTemplate.key,
              onChange: this.setTemplate
            },
              mapGenTemplateOptions
            ),
            React.DOM.div(
            {
              className: "map-setup-player-limit"
            },
              "Players: " + this.state.selectedTemplate.minPlayers + "-" +
                this.state.selectedTemplate.maxPlayers
            ),
            React.DOM.div(
            {
              className: "map-setup-description"
            },
              this.state.selectedTemplate.description
            ),
            UIComponents.MapGenOptions(
            {
              mapGenTemplate: this.state.selectedTemplate
            })
          )
        );
      }
    })
  }
}
