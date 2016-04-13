/// <reference path="../../../lib/react-0.13.3.d.ts" />

import app from "../../App"; // TODO refactor | autogenerated
import * as React from "react";

/// <reference path="../../templateinterfaces/imapgentemplate.d.ts" />
/// <reference path="mapgenoptions.ts" />


import MapGenOptions from "./MapGenOptions";
import MapGenTemplate from "../../templateinterfaces/MapGenTemplate";


interface PropTypes extends React.Props<any>
{
  setPlayerLimits: any; // TODO refactor | define prop type 123
}

interface StateType
{
  selectedTemplate?: any; // TODO refactor | define state type 456
  templates?: any; // TODO refactor | define state type 456
}

interface RefTypes extends React.Refs
{
  mapGenOptions: React.Component<any, any>; // TODO refactor | correct ref type 542 | MapGenOptions
}

export class MapSetupComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "MapSetup";

  state: StateType;
  refsTODO: RefTypes;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.setTemplate = this.setTemplate.bind(this);
    this.getMapSetupInfo = this.getMapSetupInfo.bind(this);
    this.updatePlayerLimits = this.updatePlayerLimits.bind(this);    
  }
  
  private getInitialState(): StateType
  {
    var mapGenTemplates: MapGenTemplate[] = [];

    for (var template in app.moduleData.Templates.MapGen)
    {
      if (app.moduleData.Templates.MapGen[template].key)
      {
        mapGenTemplates.push(app.moduleData.Templates.MapGen[template]);
      }
    }


    return(
    {
      templates: mapGenTemplates,
      selectedTemplate: mapGenTemplates[0]
    });
  }

  componentDidMount()
  {
    this.updatePlayerLimits();
  }

  updatePlayerLimits()
  {
    this.props.setPlayerLimits(
    {
      min: this.state.selectedTemplate.minPlayers,
      max: this.state.selectedTemplate.maxPlayers
    });
  }

  setTemplate(e: Event)
  {
    var target = <HTMLInputElement> e.target;
    this.setState(
    {
      selectedTemplate: app.moduleData.Templates.MapGen[target.value]
    }, this.updatePlayerLimits);
  }

  getMapSetupInfo()
  {
    return(
    {
      template: this.state.selectedTemplate,
      optionValues: this.ref_TODO_mapGenOptions.getOptionValuesForTemplate()
    });
  }
  
  render()
  {
    var mapGenTemplateOptions: React.HTMLElement[] = [];
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
        MapGenOptions(
        {
          mapGenTemplate: this.state.selectedTemplate,
          ref: (component: TODO_TYPE) =>
{
  this.ref_TODO_mapGenOptions = component;
}
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(MapSetupComponent);
export default Factory;
