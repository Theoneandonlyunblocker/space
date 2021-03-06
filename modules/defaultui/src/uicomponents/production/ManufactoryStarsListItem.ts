import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Star} from "core/src/map/Star";
import { localize } from "modules/defaultui/localization/localize";


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
  public override state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public override render()
  {
    const hasManufactory = Boolean(this.props.totalCapacity);
    const hasCapacity = hasManufactory && this.props.usedCapacity < this.props.totalCapacity;

    return(
      ReactDOMElements.tr(
      {
        className: "manufactory-stars-list-item" +
          (!hasManufactory ? " no-manufactory" : "") +
          (this.props.isHighlighted ? " highlighted" : ""),
        onClick: () => this.props.onClick(this.props.star),
      },
        ReactDOMElements.td(
        {
          className: "manufactory-stars-list-item-star-name",
        },
          this.props.star.name,
        ),
        ReactDOMElements.td(
        {
          className: "manufactory-stars-list-item-capacity" + (!hasCapacity ? " no-capacity" : ""),
          title: `${localize("reservedCapacity").format(this.props.usedCapacity)}\n${localize("totalCapacity").format(this.props.totalCapacity)}`
        },
          `${this.props.usedCapacity}/${this.props.totalCapacity}`,
        ),
      )
    );
  }
}

export const ManufactoryStarsListItem: React.Factory<PropTypes> = React.createFactory(ManufactoryStarsListItemComponent);
