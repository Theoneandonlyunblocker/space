/// <reference path="../../../lib/react-global.d.ts" />

import app from "../../App"; // TODO global

import MapGenTemplate from "../../templateinterfaces/MapGenTemplate";
import {default as MapGenOptions, MapGenOptionsComponent} from "./MapGenOptions";


export interface PropTypes extends React.Props<any>
{
  setPlayerLimits: (limits: {min: number; max: number;}) => void;
}

interface StateType
{
  selectedTemplate?: MapGenTemplate;
  templates?: MapGenTemplate[];
}

export class MapSetupComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "MapSetup";

  state: StateType;

  ref_TODO_mapGenOptions: MapGenOptionsComponent;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }
  private bindMethods()
  {
    this.setTemplate = this.setTemplate.bind(this);
    this.getMapSetupInfo = this.getMapSetupInfo.bind(this);
    this.updatePlayerLimits = this.updatePlayerLimits.bind(this);
  }

  private getInitialStateTODO(): StateType
  {
    const mapGenTemplates: MapGenTemplate[] = [];

    for (let template in app.moduleData.Templates.MapGen)
    {
      if (app.moduleData.Templates.MapGen[template].key)
      {
        mapGenTemplates.push(app.moduleData.Templates.MapGen[template]);
      }
    }


    return(
    {
      templates: mapGenTemplates,
      selectedTemplate: mapGenTemplates[0],
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
      max: this.state.selectedTemplate.maxPlayers,
    });
  }

  setTemplate(e: React.FormEvent)
  {
    const target = <HTMLInputElement> e.target;
    this.setState(
    {
      selectedTemplate: app.moduleData.Templates.MapGen[target.value],
    }, this.updatePlayerLimits);
  }

  getMapSetupInfo()
  {
    return(
    {
      template: this.state.selectedTemplate,
      optionValues: this.ref_TODO_mapGenOptions.getOptionValuesForTemplate(),
    });
  }

  render()
  {
    const mapGenTemplateOptions: React.ReactHTMLElement<any>[] = [];
    for (let i = 0; i < this.state.templates.length; i++)
    {
      const template = this.state.templates[i];

      mapGenTemplateOptions.push(
        React.DOM.option(
          {
            value: template.key,
            key: template.key,
            title: template.description,
          },
          template.displayName,
        ),
      );
    }

    return(
      React.DOM.div(
      {
        className: "map-setup",
      },
        React.DOM.select(
        {
          className: "map-setup-template-selector",
          value: this.state.selectedTemplate.key,
          onChange: this.setTemplate,
        },
          mapGenTemplateOptions,
        ),
        React.DOM.div(
        {
          className: "map-setup-player-limit",
        },
          "Players: " + this.state.selectedTemplate.minPlayers + "-" +
            this.state.selectedTemplate.maxPlayers,
        ),
        React.DOM.div(
        {
          className: "map-setup-description",
        },
          this.state.selectedTemplate.description,
        ),
        MapGenOptions(
        {
          mapGenTemplate: this.state.selectedTemplate,
          ref: (component: MapGenOptionsComponent) =>
          {
            this.ref_TODO_mapGenOptions = component;
          },
        }),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(MapSetupComponent);
export default Factory;
