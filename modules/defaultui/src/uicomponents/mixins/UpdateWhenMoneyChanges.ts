// TODO refactor | this should 100% be removed

import * as React from "react";

import {eventManager} from "core/src/app/eventManager";

import {MixinBase} from "./MixinBase";


export class UpdateWhenMoneyChanges<T extends React.Component<any, any>> implements MixinBase<T>
{
  private owner: T;
  private onMoneyChange?: () => void;

  constructor(owner: T, onMoneyChange?: () => void)
  {
    this.owner = owner;
    this.onMoneyChange = onMoneyChange;
    this.handleMoneyChange = this.handleMoneyChange.bind(this);
  }

  public componentDidMount()
  {
    eventManager.addEventListener("playerMoneyUpdated", this.handleMoneyChange);
  }

  public componentWillUnmount()
  {
    eventManager.removeEventListener("playerMoneyUpdated", this.handleMoneyChange);
  }

  private handleMoneyChange()
  {
    if (this.onMoneyChange)
    {
      this.onMoneyChange();
    }
    else
    {
      this.owner.setState({money: this.owner.props.player.resources.money});
    }
  }
}
