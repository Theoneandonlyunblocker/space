/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../../star.ts" />


import Star from "../../Star";


interface PropTypes extends React.Props<any>
{
  star: Star;
  isHighlighted: boolean;
  usedCapacity: number;
  totalCapacity: number;
  onClick: reactTypeTODO_func;
}

interface StateType
{
}

export class ManufactoryStarsListItemComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "ManufactoryStarsListItem";


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleClick = this.handleClick.bind(this);    
  }
  
  handleClick()
  {
    var star = this.props.star;
    this.props.onClick(star);
  }

  render()
  {
    var star = this.props.star;
    var isHighlighted = this.props.isHighlighted;
    var usedCapacity = this.props.usedCapacity;
    var totalCapacity = this.props.totalCapacity;

    var hasManufcatory = Boolean(totalCapacity);
    var hasCapacity = hasManufcatory && usedCapacity < totalCapacity;

    return(
      React.DOM.div(
      {
        className: "manufactory-stars-list-item" +
          (!hasManufcatory ? " no-manufactory" : "") +
          (isHighlighted ? " highlighted" : ""),
        onClick: this.handleClick
      },
        React.DOM.div(
        {
          className: "manufactory-stars-list-item-star-name"
        },
          star.name
        ),
        !hasManufcatory ? null : React.DOM.div(
        {
          className: "manufactory-stars-list-item-capacity" + (!hasCapacity ? " no-capacity" : "")
        },
          "" + usedCapacity + "/" + totalCapacity
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(ManufactoryStarsListItemComponent);
export default Factory;
