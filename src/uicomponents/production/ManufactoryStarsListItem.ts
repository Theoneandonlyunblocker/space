import * as React from "react";

import Star from "../../Star";


export interface PropTypes extends React.Props<any>
{
  star: Star;
  isHighlighted: boolean;
  usedCapacity: number;
  totalCapacity: number;
  onClick: (star: Star) => void;
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
    const star = this.props.star;
    this.props.onClick(star);
  }

  render()
  {
    const hasManufactory = Boolean(this.props.totalCapacity);
    const hasCapacity = hasManufactory && this.props.usedCapacity < this.props.totalCapacity;

    return(
      React.DOM.div(
      {
        className: "manufactory-stars-list-item" +
          (!hasManufactory ? " no-manufactory" : "") +
          (this.props.isHighlighted ? " highlighted" : ""),
        onClick: this.handleClick,
      },
        React.DOM.div(
        {
          className: "manufactory-stars-list-item-star-name",
        },
          this.props.star.name,
        ),
        !hasManufactory ? null : React.DOM.div(
        {
          className: "manufactory-stars-list-item-capacity" + (!hasCapacity ? " no-capacity" : ""),
        },
          "" + this.props.usedCapacity + "/" + this.props.totalCapacity,
        ),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(ManufactoryStarsListItemComponent);
export default Factory;
