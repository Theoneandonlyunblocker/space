/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="manufacturablethingslistitem.ts" />


import ManufacturableThingsListItem from "./ManufacturableThingsListItem.ts";


interface PropTypes extends React.Props<any>
{
  manufacturableThings: reactTypeTODO_couldntConvert;
  onClick?: reactTypeTODO_func;
  showCost: boolean;
  money?: number;
}

interface StateType
{
}

export class ManufacturableThingsListComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "ManufacturableThingsList";
  mixins: reactTypeTODO_any = [React.addons.PureRenderMixin];


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }
  
  render()
  {
    var manufacturableThings: IManufacturableThing[] = this.props.manufacturableThings;

    var items: React.ReactElement<any>[] = [];
    var keyByTemplateType:
    {
      [templateType: string]: number;
    } = {};

    for (var i = 0; i < manufacturableThings.length; i++)
    {
      var templateType = manufacturableThings[i].type;
      if (!keyByTemplateType[templateType])
      {
        keyByTemplateType[templateType] = 0;
      }

      items.push(ManufacturableThingsListItem(
      {
        template: manufacturableThings[i],
        key: templateType + keyByTemplateType[templateType]++,
        parentIndex: i,
        onClick: this.props.onClick,
        money: this.props.money,
        showCost: this.props.showCost
      }));
    }

    return(
      React.DOM.ol(
      {
        className: "manufacturable-things-list"
      },
        items
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(ManufacturableThingsListComponent);
export default Factory;
