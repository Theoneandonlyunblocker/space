/// <reference path="manufacturablethingslistitem.ts" />

module Rance
{
  export module UIComponents
  {
    export var ManufacturableThingsList = React.createClass(
    {
      displayName: "ManufacturableThingsList",
      mixins: [React.addons.PureRenderMixin],

      propTypes:
      {
        manufacturableThings: React.PropTypes.array.isRequired,
        onClick: React.PropTypes.func
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
            onClick: this.props.onClick
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
    })
  }
}
