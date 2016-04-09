/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes
{
  template: reactTypeTODO_any;
  parentIndex: number;
  onClick?: reactTypeTODO_func;
  showCost: boolean;
  money?: number;
}

interface StateType
{
  // TODO refactor | add state type
}

export default class ManufacturableThingsListItem extends React.Component<PropTypes, {}>
{
  displayName: string = "ManufacturableThingsListItem";


  state:
  {
    
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  private getInitialState()
  {
    return(
    {
      canAfford: this.props.money >= this.props.template.buildCost,
      isDisabled: !this.props.onClick
    });
  }
  
  componentWillReceiveProps(newProps: any)
  {
    this.setState(
    {
      canAfford: newProps.money >= newProps.template.buildCost,
      isDisabled: !newProps.onClick
    });
  }
  

  handleClick()
  {
    if (this.props.onClick)
    {
      this.props.onClick(this.props.template, this.props.parentIndex);
    }
  }

  render()
  {
    var template: IManufacturableThing = this.props.template;
    var isDisabled: boolean = this.state.isDisabled;
    if (this.props.showCost)
    {
      isDisabled = isDisabled || !this.state.canAfford;
    }

    return(
      React.DOM.li(
      {
        className: "manufacturable-things-list-item" + (isDisabled ? " disabled" : ""),
        onClick: (isDisabled ? null : this.handleClick),
        disabled: isDisabled,
        title: template.description
      },
        React.DOM.div(
        {
          className: "manufacturable-things-list-item-name"
        },
          template.displayName
        ),
        !this.props.showCost ? null : React.DOM.div(
        {
          className: "manufacturable-things-list-item-cost money-style" +
            (this.state.canAfford ? "" : " negative")
        },
          template.buildCost
        )
      )
    );
  }
}
