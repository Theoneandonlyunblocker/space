/// <reference path="../../../lib/react-global.d.ts" />

import MixinBase from "./MixinBase";

export interface FocusTimerProps
{
  graceTime?: number;
}

export default class FocusTimer<T extends React.Component<any, any>> implements MixinBase<T>
{
  lastFocusTime: number;
  
  private owner: T;
  private get props(): FocusTimerProps
  {
    return this.owner.props.focusTimerProps;
  }
  
  constructor(owner: T)
  {
    this.owner = owner;
    
    this.setFocusTimer = this.setFocusTimer.bind(this);
  }
  
  public componentDidMount()
  {
    this.setFocusTimer();
  }
  
  public registerListener()
  {
    window.addEventListener("focus", this.setFocusTimer, false);
  }
  public clearListener()
  {
    window.removeEventListener("focus", this.setFocusTimer);
  }
  public isWithinGracePeriod(): boolean
  {
    const graceTime = this.props && isFinite(this.props.graceTime) ? this.props.graceTime : 500;
    
    return Date.now() < this.lastFocusTime + graceTime;
  }
  
  private setFocusTimer()
  {
    this.lastFocusTime = Date.now();
  }
}
