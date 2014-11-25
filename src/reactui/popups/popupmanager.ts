/// <reference path="popup.ts"/>

module Rance
{
  export module UIComponents
  {
    export var PopupManager = React.createClass(
    {

      getInitialState: function()
      {
        return(
        {
          popups:
          [
            {
              content: React.DOM.div({style: {backgroundColor: "white"}}, "lol"),
              id: 0
            }
          ]
        });
        return(
        {
          popups: []
        });
      },

      incrementZIndex: function()
      {
        if (!this.currentZIndex) this.currentZIndex = 0;

        return this.currentZIndex++;
      },

      getPopupId: function()
      {
        if (!this.popupId) this.popupId = 0;

        return this.popupId++;
      },

      hasPopup: function(id: number)
      {
        for (var i = 0; i < this.state.popups.length; i++)
        {
          if (this.state.popups[i].id === id) return true;
        }

        return false;
      },

      removePopup: function(id: number)
      {
        if (!this.hasPopup) throw new Error("No such popup");

        var newPopups = [];

        for (var i = 0; i < this.state.popups.length; i++)
        {
          if (this.state.popups[i].id !== id)
          {
            newPopups.push(this.state.popups[i]);
          }
        }

        this.setState({popups: newPopups});
      },

      makePopup: function(props:
      {
        content: any;  
      })
      {
        this.setState(
        {
          popups: this.state.popups.push(
          {
            content: props.content,
            id: this.getPopupId()
          })
        });
      },

      render: function()
      {
        var popups:
        {
          id: number;
          content: any;
        }[] = this.state.popups;

        var toRender = [];

        for (var i = 0; i < popups.length; i++)
        {
          var popup = popups[i];

          toRender.push(
            UIComponents.Popup(
            {
              content: popup.content,
              key: popup.id,
              incrementZIndex: this.incrementZIndex,
              containerElement: this.refs.containerDiv
            })
          );
        }

        return(
          React.DOM.div(
          {
            className: "popup-container",
            ref: "containerDiv"
          },
            toRender
          )
        );
      }
    });
  }
}