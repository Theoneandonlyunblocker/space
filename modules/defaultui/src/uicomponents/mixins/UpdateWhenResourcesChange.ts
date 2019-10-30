// prefer useResources when writing new components

import * as React from "react";

import {MixinBase} from "./MixinBase";
import { updaters, getUpdaterId } from "../resources/useResources";
import { Player } from "core/src/player/Player";


export class UpdateWhenResourcesChange<T extends React.Component<any, any>> implements MixinBase<T>
{
  private readonly player: Player;
  private readonly onResourceChange: () => void;
  private readonly updaterId = getUpdaterId();

  constructor(player: Player, onResourceChange: () => void)
  {
    this.player = player;
    this.onResourceChange = onResourceChange;
    this.handleResourceChange = this.handleResourceChange.bind(this);
  }

  public componentDidMount()
  {
    updaters[this.updaterId] = {
      update: this.handleResourceChange,
      shouldUpdate: player => player === this.player,
    };
  }

  public componentWillUnmount()
  {
    updaters[this.updaterId] = null;
    delete updaters[this.updaterId];
  }

  private handleResourceChange()
  {
    this.onResourceChange();
  }
}
