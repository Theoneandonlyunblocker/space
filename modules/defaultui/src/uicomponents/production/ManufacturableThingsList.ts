import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {ManufacturableThing} from "core/src/templateinterfaces/ManufacturableThing";

import {ManufacturableThingsListItem} from "./ManufacturableThingsListItem";
import { Player } from "core/src/player/Player";


export interface PropTypes extends React.Props<any>
{
  manufacturableThings: ManufacturableThing[];
  onClick?: (toManufacture: ManufacturableThing, parentIndex?: number) => void;
  showCost: boolean;
  player: Player | null;
}

interface StateType
{
}

export class ManufacturableThingsListComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName = "ManufacturableThingsList";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    const manufacturableThings: ManufacturableThing[] = this.props.manufacturableThings;

    const keyByTemplateType:
    {
      [templateType: string]: number;
    } = {};

    const items = manufacturableThings.sort((a, b) =>
    {
      return a.displayName.localeCompare(b.displayName);
    }).map((template, i) =>
    {

      if (!keyByTemplateType[template.type])
      {
        keyByTemplateType[template.type] = 0;
      }

      return ManufacturableThingsListItem(
      {
        key: template.type + keyByTemplateType[template.type]++,
        template: manufacturableThings[i],
        parentIndex: i,
        onClick: this.props.onClick,
        showCost: this.props.showCost,
        player: this.props.player,
      });
    });

    return(
      ReactDOMElements.ol(
      {
        className: "manufacturable-things-list",
      },
        items,
      )
    );
  }
}

export const ManufacturableThingsList: React.Factory<PropTypes> = React.createFactory(ManufacturableThingsListComponent);
