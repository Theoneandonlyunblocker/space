/// <reference path="../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="playerflag.ts" />


import Flag from "../Flag";
import {generateColorScheme} from "../colorGeneration";

import PlayerFlag from "./PlayerFlag";


interface PropTypes extends React.Props<any>
{
}

interface StateType
{
  size?: number;
}

export class FlagMakerComponent extends React.Component<PropTypes, StateType>
{
  setStateTimeoutHandle: number = undefined;
  sizeValue: number = 46;
  state: StateType;
  ref_TODO_flags: React.HTMLComponent;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.makeFlags = this.makeFlags.bind(this);    
  }
  
  private getInitialState(): StateType
  {
    return(
    {
      size: 46
    });
  }

  handleSizeChange(e: React.FormEvent)
  {
    if (this.setStateTimeoutHandle)
    {
      window.clearTimeout(this.setStateTimeoutHandle);
    }
    var target = <HTMLInputElement> e.target;
    var value = parseInt(target.value);
    if (isFinite(value))
    {
      this.sizeValue = value;
      this.setStateTimeoutHandle = window.setTimeout(this.setState.bind(this, {size: value}), 500);
    }
  }
  makeFlags()
  {
    this.forceUpdate();
  }
  render()
  {
    var flagElements: React.ReactElement<any>[] = [];
    for (var i = 0; i < 100; i++)
    {
      var colorScheme = generateColorScheme();

      var flag = new Flag(
      {
        width: this.state.size,
        mainColor: colorScheme.main,
        secondaryColor: colorScheme.secondary
      });

      flag.generateRandom();

      flagElements.push(PlayerFlag(
      {
        key: i,
        props:
        {
          width: this.state.size,
          height: this.state.size,
          style:
          {
            width: this.state.size,
            height: this.state.size
          }
        },
        flag: flag
      }));
    }
    return(
      React.DOM.div(null,
        React.DOM.div(
        {
          className: "flags",
          ref: (component: React.HTMLComponent) =>
          {
            this.ref_TODO_flags = component;
          } 
        },
          flagElements
        ),
        React.DOM.button(
        {
          onClick: this.makeFlags
        }, "make flags"),
        React.DOM.input(
        {
          onChange: this.handleSizeChange,
          defaultValue: "" + this.sizeValue,
          type: "number"
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(FlagMakerComponent);
export default Factory;
