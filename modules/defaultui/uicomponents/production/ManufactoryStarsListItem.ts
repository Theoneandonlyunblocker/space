import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Star} from "../../../../src/map/Star";


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
  public displayName = "ManufactoryStarsListItem";


  public state: StateType;

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
      ReactDOMElements.div(
      {
        className: "manufactory-stars-list-item" +
          (!hasManufactory ? " no-manufactory" : "") +
          (this.props.isHighlighted ? " highlighted" : ""),
        onClick: this.handleClick,
      },
        ReactDOMElements.div(
        {
          className: "manufactory-stars-list-item-star-name",
        },
          this.props.star.name,
        ),
        !hasManufactory ? null : ReactDOMElements.div(
        {
          className: "manufactory-stars-list-item-capacity" + (!hasCapacity ? " no-capacity" : ""),
        },
          `${this.props.usedCapacity}/${this.props.totalCapacity}`,
        ),
      )
    );
  }
}

export const ManufactoryStarsListItem: React.Factory<PropTypes> = React.createFactory(ManufactoryStarsListItemComponent);
