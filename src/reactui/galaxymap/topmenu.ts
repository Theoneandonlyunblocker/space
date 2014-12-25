/// <reference path="lightbox.ts"/>

module Rance
{
  export module UIComponents
  {
    export var TopMenu = React.createClass(
    {
      displayName: "TopMenu",
      getInitialState: function()
      {
        return(
        {
          opened: null,
          lightBoxElement: null
        });
      },

      handleEquipItems: function()
      {
        if (this.state.opened === "equipItems")
        {
          this.closeLightBox();
        }
        else
        {
          this.setState(
          {
            opened: "equipItems",
            lightBoxElement: this.makeLightBox("equipItems")
          });
        }
      },

      closeLightBox: function()
      {
        this.setState(
        {
          opened: null,
          lightBoxElement: null
        });
      },


      makeLightBox: function(type)
      {
        switch (type)
        {
          case "equipItems":
          {
            return(
              UIComponents.LightBox(
              {
                handleClose: this.closeLightBox,
                content: UIComponents.ItemEquip(
                {
                  player: this.props.player
                })
              })
            );
          }
          default:
          {
            return null;
          }
        }
      },

      render: function()
      {
        return(
          React.DOM.div(
          {
            className: "top-menu"
          },
            React.DOM.div(
            {
              className: "top-menu-items"
            },
              React.DOM.button(
              {
                className: "top-menu-items-button",
                onClick: this.handleEquipItems
              }, "Equip Items")
            ),
            this.state.lightBoxElement
          )
        );
      }
    })
  }
}
