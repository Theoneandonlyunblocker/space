/// <reference path="manufacturablethingslistitem.ts" />

export interface PropTypes
{
  manufacturableThings: reactTypeTODO_couldntConvert;
  onClick?: reactTypeTODO_func;
  showCost: boolean;
  money?: number;
}

export var ManufacturableThingsList = React.createFactory(React.createClass(
{
  displayName: "ManufacturableThingsList",
  mixins: [React.addons.PureRenderMixin],

  propTypes:
  {
    manufacturableThings: React.PropTypes.array.isRequired,
    onClick: React.PropTypes.func,
    showCost: React.PropTypes.bool.isRequired,
    money: React.PropTypes.number
  },

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
}));
