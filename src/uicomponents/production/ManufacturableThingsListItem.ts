import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import ManufacturableThing from "../../templateinterfaces/ManufacturableThing";


export interface PropTypes extends React.Props<any>
{
  template: ManufacturableThing;
  parentIndex: number;
  onClick?: (template: ManufacturableThing, parentIndex?: number) => void;
  showCost: boolean;
  money: number;
}

interface StateType
{
}

export class ManufacturableThingsListItemComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "ManufacturableThingsListItem";


  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = {};

    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleClick = this.handleClick.bind(this);
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
    const canAfford = this.props.money >= this.props.template.buildCost;
    const isDisabled = !Boolean(this.props.onClick) || (this.props.showCost && !canAfford);

    return(
      ReactDOMElements.li(
      {
        className: "manufacturable-things-list-item" + (isDisabled ? " disabled" : ""),
        onClick: (isDisabled ? null : this.handleClick),
        title: this.props.template.description,
      },
        ReactDOMElements.div(
        {
          className: "manufacturable-things-list-item-name",
        },
          this.props.template.displayName,
        ),
        !this.props.showCost ? null : ReactDOMElements.div(
        {
          className: "manufacturable-things-list-item-cost money-style" +
            (canAfford ? "" : " negative"),
        },
          this.props.template.buildCost,
        ),
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(ManufacturableThingsListItemComponent);
export default factory;
