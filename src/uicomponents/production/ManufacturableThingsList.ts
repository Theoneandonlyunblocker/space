/// <reference path="../../../lib/react-global.d.ts" />

import ManufacturableThingsListItem from "./ManufacturableThingsListItem";
import ManufacturableThing from "../../templateinterfaces/ManufacturableThing";

interface PropTypes extends React.Props<any>
{
  manufacturableThings: ManufacturableThing[];
  onClick?: (toManufacture: ManufacturableThing, parentIndex: number) => void;
  showCost: boolean;
  money?: number;
}

interface StateType
{
}

export class ManufacturableThingsListComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "ManufacturableThingsList";
  shouldComponentUpdate = React.addons.PureRenderMixin.shouldComponentUpdate.bind(this);


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }
  
  render()
  {
    var manufacturableThings: ManufacturableThing[] = this.props.manufacturableThings;

    var items: React.ReactElement<any>[] = [];
    var keyByTemplateType:
    {
      [templateType: string]: number;
    } = {};

    for (let i = 0; i < manufacturableThings.length; i++)
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
