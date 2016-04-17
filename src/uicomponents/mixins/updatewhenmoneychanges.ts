// TODO refactor | this should 100% be removed

/// <reference path="../../../lib/react-global.d.ts" />

import MixinBase from "./MixinBase";

import eventManager from "../../eventManager";


export default class UpdateWhenMoneyChanges<T extends React.Component<any, any>> implements MixinBase<T>
{
  private owner: T;
  private onMoneyChange: () => void;
  
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
      this.owner.setState({money: this.owner.props.player.money});
    }
  }
}
