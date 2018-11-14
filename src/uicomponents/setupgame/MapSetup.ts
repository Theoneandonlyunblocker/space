import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import {activeModuleData} from "../../activeModuleData";
import MapGenTemplate from "../../templateinterfaces/MapGenTemplate";

import {default as MapGenOptions, MapGenOptionsComponent} from "./MapGenOptions";


export interface PropTypes extends React.Props<any>
{
  setPlayerLimits: (limits: {min: number; max: number}) => void;
}

interface StateType
{
  selectedTemplate: MapGenTemplate;
  templates: MapGenTemplate[];
}

export class MapSetupComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "MapSetup";

  public state: StateType;

  public mapGenOptionsComponent = React.createRef<MapGenOptionsComponent>();

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

    for (const template in activeModuleData.templates.MapGen)
    {
      if (activeModuleData.templates.MapGen[template].key)
      {
        mapGenTemplates.push(activeModuleData.templates.MapGen[template]);
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

  setTemplate(e: React.FormEvent<HTMLSelectElement>)
  {
    const target = e.currentTarget;
    this.setState(
    {
      selectedTemplate: activeModuleData.templates.MapGen[target.value],
    }, this.updatePlayerLimits);
  }

  getMapSetupInfo()
  {
    return(
    {
      template: this.state.selectedTemplate,
      optionValues: this.mapGenOptionsComponent.current.getOptionValuesForTemplate(),
    });
  }

  render()
  {
    const mapGenTemplateOptions: React.ReactHTMLElement<any>[] = [];
    for (let i = 0; i < this.state.templates.length; i++)
    {
      const template = this.state.templates[i];

      mapGenTemplateOptions.push(
        ReactDOMElements.option(
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
      ReactDOMElements.div(
      {
        className: "map-setup",
      },
        ReactDOMElements.select(
        {
          className: "map-setup-template-selector",
          value: this.state.selectedTemplate.key,
          onChange: this.setTemplate,
        },
          mapGenTemplateOptions,
        ),
        ReactDOMElements.div(
        {
          className: "map-setup-player-limit",
        },
          localize("allowedPlayerCount")(
          {
            min: this.state.selectedTemplate.minPlayers,
            max: this.state.selectedTemplate.maxPlayers,
          }),
        ),
        ReactDOMElements.div(
        {
          className: "map-setup-description",
        },
          this.state.selectedTemplate.description,
        ),
        MapGenOptions(
        {
          mapGenTemplate: this.state.selectedTemplate,
          ref: this.mapGenOptionsComponent,
        }),
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(MapSetupComponent);
export default factory;
