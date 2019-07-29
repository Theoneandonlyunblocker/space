import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";
import {activeModuleData} from "../../../../src/activeModuleData";
import {MapGenTemplate} from "../../../../src/templateinterfaces/MapGenTemplate";
import { getRandomProperty } from "../../../../src/utility";

import {MapGenOptions, MapGenOptionsComponent} from "./MapGenOptions";


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

  public readonly mapGenOptionsComponent = React.createRef<MapGenOptionsComponent>();

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleSelectTemplate = this.handleSelectTemplate.bind(this);
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

  public async randomize(): Promise<void>
  {
    const template = getRandomProperty(activeModuleData.templates.MapGen);

    await this.setTemplate(template);

    await this.mapGenOptionsComponent.current.randomizeOptions();

    return;
  }
  private setTemplate(template: MapGenTemplate): Promise<MapGenTemplate>
  {
    return new Promise(resolve =>
    {
      this.setState(
      {
        selectedTemplate: template,
      }, () =>
      {
        this.updatePlayerLimits();

        resolve();
      });
    });
  }
  private handleSelectTemplate(e: React.FormEvent<HTMLSelectElement>): void
  {
    const target = e.currentTarget;
    const selectedTemplate = activeModuleData.templates.MapGen[target.value];

    this.setTemplate(selectedTemplate);
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
          onChange: this.handleSelectTemplate,
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

export const MapSetup: React.Factory<PropTypes> = React.createFactory(MapSetupComponent);
