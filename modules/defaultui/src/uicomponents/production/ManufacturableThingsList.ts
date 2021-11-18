import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {ManufacturableThing} from "core/src/templateinterfaces/ManufacturableThing";

import {ManufacturableThingsListItem} from "./ManufacturableThingsListItem";
import { Player } from "core/src/player/Player";


export interface PropTypes<T extends ManufacturableThing> extends React.Props<any>
{
  manufacturableThings: T[];
  onClick?: (toManufacture: T, parentIndex?: number) => void;
  showCost: boolean;
  player: Player | null;
}

interface StateType
{
}

export class ManufacturableThingsListComponent<T extends ManufacturableThing> extends React.PureComponent<PropTypes<T>, StateType>
{
  public displayName = "ManufacturableThingsList";
  public override state: StateType;

  constructor(props: PropTypes<T>)
  {
    super(props);
  }

  public override render()
  {
    const manufacturableThings: T[] = this.props.manufacturableThings;

    const keyByTemplateType:
    {
      [templateType: string]: number;
    } = {};

    const items = manufacturableThings.sort((a, b) =>
    {
      return a.displayName.localeCompare(b.displayName);
    }).map((template, i) =>
    {

      if (!keyByTemplateType[template.key])
      {
        keyByTemplateType[template.key] = 0;
      }

      return ManufacturableThingsListItem(
      {
        key: template.key + keyByTemplateType[template.key]++,
        template: manufacturableThings[i],
        parentIndex: i,
        onClick: <any>this.props.onClick,
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

const factory = React.createFactory(ManufacturableThingsListComponent);

export function ManufacturableThingsList<T extends ManufacturableThing>(props?: React.Attributes & PropTypes<T>, ...children: React.ReactNode[]): React.ReactElement<PropTypes<T>>
{
  return <any>factory(<any>props, ...children);
}
