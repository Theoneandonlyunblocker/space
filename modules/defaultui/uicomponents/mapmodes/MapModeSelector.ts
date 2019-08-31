import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";


import {MapRenderer} from "../../../../src/maprenderer/MapRenderer";


export interface PropTypes extends React.Props<any>
{
  mapRenderer: MapRenderer;
  onUpdate?: () => void;
}

interface StateType
{
}

export class MapModeSelectorComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "MapModeSelector";


  handleChange(e: React.FormEvent<HTMLSelectElement>)
  {
    const target = e.currentTarget;
    const value = target.value;
    this.props.mapRenderer.setMapModeByKey(value);

    if (this.props.onUpdate)
    {
      this.props.onUpdate();
    }
  }

  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();
  }
  private bindMethods()
  {
    this.makeOptions = this.makeOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  makeOptions()
  {
    const mapRenderer = this.props.mapRenderer;
    const options: React.ReactHTMLElement<any>[] = [];

    for (const key in mapRenderer.mapModes)
    {
      const mapMode = mapRenderer.mapModes[key];
      options.push(ReactDOMElements.option(
      {
        value: key,
        key: key,
      },
        mapMode.displayName,
      ));
    }

    return options;
  }


  render()
  {
    const mapRenderer = this.props.mapRenderer;

    return(
      ReactDOMElements.select(
      {
        className: "map-mode-selector",
        value: mapRenderer.currentMapMode.template.key,
        onChange: this.handleChange,
      },
        this.makeOptions(),
      )
    );
  }
}

export const MapModeSelector: React.Factory<PropTypes> = React.createFactory(MapModeSelectorComponent);
