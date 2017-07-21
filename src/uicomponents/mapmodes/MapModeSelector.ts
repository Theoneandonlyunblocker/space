import * as React from "react";


import MapRenderer from "../../MapRenderer";


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
  displayName: string = "MapModeSelector";


  handleChange(e: React.FormEvent)
  {
    const target = <HTMLInputElement> e.target;
    const value = target.value;
    this.props.mapRenderer.setMapModeByKey(value);

    if (this.props.onUpdate)
    {
      this.props.onUpdate();
    }
  }

  state: StateType;

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

    for (let key in mapRenderer.mapModes)
    {
      const mapMode = mapRenderer.mapModes[key];
      options.push(React.DOM.option(
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
      React.DOM.select(
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

const Factory: React.Factory<PropTypes> = React.createFactory(MapModeSelectorComponent);
export default Factory;
