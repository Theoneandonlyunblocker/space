import * as React from "react";

import ManufacturableThing from "../../templateinterfaces/ManufacturableThing";

export interface PropTypes extends React.Props<any>
{
  template: ManufacturableThing;
  parentIndex: number;
  onClick?: (template: ManufacturableThing, parentIndex: number) => void;
  showCost: boolean;
  money?: number;
}

interface StateType
{
}

export class ManufacturableThingsListItemComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "ManufacturableThingsListItem";


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleClick = this.handleClick.bind(this);
  }

  private getInitialStateTODO(): StateType
  {
    return(
    {
      canAfford: this.props.money >= this.props.template.buildCost,
      isDisabled: !this.props.onClick,
    });
  }

  componentWillReceiveProps(newProps: PropTypes)
  {
    this.setState(
    {
      canAfford: newProps.money >= newProps.template.buildCost,
      isDisabled: !newProps.onClick,
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
    const canAfford = this.props.money >= this.props.template.buildCost;
    const isDisabled = !Boolean(this.props.onClick) || (this.props.showCost && !canAfford);

    // TODO 2017.07.21 | use li to wrap a button
    return(
      React.DOM.li(
      {
        className: "manufacturable-things-list-item" + (isDisabled ? " disabled" : ""),
        onClick: (isDisabled ? null : this.handleClick),
        disabled: isDisabled,
        title: this.props.template.description,
      },
        React.DOM.div(
        {
          className: "manufacturable-things-list-item-name",
        },
          this.props.template.displayName,
        ),
        !this.props.showCost ? null : React.DOM.div(
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

const Factory: React.Factory<PropTypes> = React.createFactory(ManufacturableThingsListItemComponent);
export default Factory;
