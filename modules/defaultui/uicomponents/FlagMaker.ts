import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Flag} from "../../../src/Flag";
import {generateColorScheme} from "../../../src/colorGeneration";

import {PlayerFlag} from "./PlayerFlag";


export interface PropTypes extends React.Props<any>
{
}

interface StateType
{
  size: number;
}

export class FlagMakerComponent extends React.Component<PropTypes, StateType>
{
  setStateTimeoutHandle: number = undefined;
  sizeValue: number = 46;
  public state: StateType;
  private readonly flagsElement = React.createRef<HTMLDivElement>();

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.makeFlags = this.makeFlags.bind(this);
  }

  private getInitialStateTODO(): StateType
  {
    return(
    {
      size: 46,
    });
  }

  handleSizeChange(e: React.FormEvent<HTMLInputElement>)
  {
    if (this.setStateTimeoutHandle)
    {
      window.clearTimeout(this.setStateTimeoutHandle);
    }
    const target = e.currentTarget;
    const value = parseInt(target.value);
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
    const flagElements: React.ReactElement<any>[] = [];
    for (let i = 0; i < 100; i++)
    {
      const colorScheme = generateColorScheme();

      const flag = new Flag(colorScheme.main);
      flag.addRandomEmblem(colorScheme.secondary);

      flagElements.push(PlayerFlag(
      {
        key: i,
        flag: flag,
        props:
        {
          width: this.state.size,
          height: this.state.size,
          style:
          {
            width: this.state.size,
            height: this.state.size,
          },
        },
      }));
    }

    return(
      ReactDOMElements.div(null,
        ReactDOMElements.div(
        {
          className: "flag-maker-flags",
          ref: this.flagsElement,
        },
          flagElements,
        ),
        ReactDOMElements.button(
        {
          onClick: this.makeFlags,
        }, "make flags"),
        ReactDOMElements.input(
        {
          onChange: this.handleSizeChange,
          defaultValue: "" + this.sizeValue,
          type: "number",
        }),
      )
    );
  }
}

export const FlagMaker: React.Factory<PropTypes> = React.createFactory(FlagMakerComponent);
