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
    if (!updaters[this.player.id])
    {
      updaters[this.player.id] = {};
    }
    updaters[this.player.id][this.updaterId] = this.handleResourceChange;
  }

  public componentWillUnmount()
  {
    updaters[this.player.id][this.updaterId] = null;
    delete updaters[this.player.id][this.updaterId];
  }

  private handleResourceChange()
  {
    this.onResourceChange();
  }
}
