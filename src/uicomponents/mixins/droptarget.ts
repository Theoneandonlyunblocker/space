// used to register event listeners for manually firing drop events because touch events suck

/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

import MixinBase from "./MixinBase";
import eventManager from "../../eventManager";

let idGenerator = 0;

export default class DropTarget<T extends React.Component<any, any>> implements MixinBase<T>
{
  private id: number;
  private handleMouseUp: () => void;
  
  constructor(handleMouseUp: () => void)
  {
    this.id = idGenerator++;
    this.handleMouseUp = handleMouseUp;
  }
  
  public componentDidMount()
  {
    eventManager.addEventListener("drop" + this.id, this.handleMouseUp);
  }
  public componentWillUnmount()
  {
    eventManager.removeEventListener("drop" + this.id, this.handleMouseUp);
  }
}
