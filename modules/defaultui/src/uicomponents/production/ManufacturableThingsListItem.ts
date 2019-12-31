import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {ManufacturableThing} from "core/src/templateinterfaces/ManufacturableThing";
import { ResourceCost } from "../resources/ResourceCost";
import { Player } from "core/src/player/Player";
import {UpdateWhenResourcesChange} from "../mixins/UpdateWhenResourcesChange";
import {applyMixins} from "../mixins/applyMixins";
import { Resources } from "core/src/player/PlayerResources";


export interface PropTypes extends React.Props<any>
{
  template: ManufacturableThing;
  parentIndex: number;
  onClick?: (template: ManufacturableThing, parentIndex?: number) => void;
  showCost: boolean;
  player: Player | null;
}

interface StateType
{
  canClick: boolean;
  availableResources: Resources | undefined;
}

export class ManufacturableThingsListItemComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "ManufacturableThingsListItem";


  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getState();

    this.handleClick = this.handleClick.bind(this);
    this.getState = this.getState.bind(this);

    applyMixins(this, new UpdateWhenResourcesChange(props.player, () =>
    {
      this.setState(this.getState());
    }));
  }

  public render()
  {
    const isDisabled = !this.state.canClick;

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
        !this.props.showCost ? null : ResourceCost(
        {
          cost: this.props.template.buildCost,
          availableResources: this.state.availableResources,
        }),
      )
    );
  }

  private handleClick(): void
  {
    if (this.props.onClick)
    {
      this.props.onClick(this.props.template, this.props.parentIndex);
    }
  }
  private getState(): StateType
  {
    const cost = this.props.template.buildCost;
    const canAfford = this.props.player && this.props.player.canAfford(cost);

    return(
    {
      canClick: this.props.onClick && (!this.props.showCost || canAfford),
      availableResources: this.props.player ? {...this.props.player.resources} : undefined,
    });
  }
}

export const ManufacturableThingsListItem: React.Factory<PropTypes> = React.createFactory(ManufacturableThingsListItemComponent);
