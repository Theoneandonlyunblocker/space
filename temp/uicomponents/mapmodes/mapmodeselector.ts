/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../../maprenderer.ts" />

export interface PropTypes
{
  mapRenderer: MapRenderer;
  onUpdate?: reactTypeTODO_func;
}

export default class MapModeSelector extends React.Component<PropTypes, {}>
{
  displayName: string = "MapModeSelector";


  handleChange(e: Event)
  {
    var target = <HTMLInputElement> e.target;
    var value = target.value;
    this.props.mapRenderer.setMapModeByKey(value);

    if (this.props.onUpdate)
    {
      this.props.onUpdate();
    }
  }

  state:
  {
    
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  makeOptions()
  {
    var mapRenderer: MapRenderer = this.props.mapRenderer;
    var options: ReactDOMPlaceHolder[] = [];

    for (var key in mapRenderer.mapModes)
    {
      var mapMode = mapRenderer.mapModes[key];
      options.push(React.DOM.option(
      {
        value: key,
        key: key
      },
        mapMode.displayName
      ))
    }

    return options;
  }
  

  render()
  {
    var mapRenderer: MapRenderer = this.props.mapRenderer;

    return(
      React.DOM.select(
      {
        className: "map-mode-selector",
        value: mapRenderer.currentMapMode.template.key,
        onChange: this.handleChange
      },
        this.makeOptions()
      )
    );
  }
}
