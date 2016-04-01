/// <reference path="manufacturablethingslistitem.ts" />

export interface PropTypes
{
  manufacturableThings: reactTypeTODO_couldntConvert;
  onClick?: reactTypeTODO_func;
  showCost: boolean;
  money?: number;
}

export default class ManufacturableThingsList extends React.Component<PropTypes, {}>
{
  displayName: "ManufacturableThingsList",
  mixins: [React.addons.PureRenderMixin],


  render: function()
  {
    var manufacturableThings: IManufacturableThing[] = this.props.manufacturableThings;

    var items: ReactComponentPlaceHolder[] = [];
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

      items.push(UIComponents.ManufacturableThingsListItem(
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
