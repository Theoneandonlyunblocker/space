/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../../player.ts" />

export interface PropTypes
{
  player?: Player;
}

export default class PlayerMoney extends React.Component<PropTypes, {}>
{
  displayName: string = "PlayerMoney";
  lastAmountRendered: reactTypeTODO_any = undefined;


  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  componentDidMount()
  {
    eventManager.addEventListener("playerMoneyUpdated", this.handlePlayerMoneyUpdated);
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  componentWillUnmount()
  {
    eventManager.removeEventListener("playerMoneyUpdated", this.handlePlayerMoneyUpdated);
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  handlePlayerMoneyUpdated()
  {
    if (this.props.player.money !== this.lastAmountRendered)
    {
      this.forceUpdate();
    }
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  render()
  {
    this.lastAmountRendered = this.props.player.money;

    return(
      React.DOM.div(
      {
        className: "player-money"
      },
        "Money: " + this.props.player.money
      )
    );
  }
}
