/// <reference path="popup.ts"/>

module Rance
{
  export module UIComponents
  {
    export var PopupManager = React.createClass(
    {

      componentWillMount: function()
      {
        this.listeners = {};
        var self = this;
        this.listeners["makePopup"] =
          eventManager.addEventListener("makePopup", function(e)
          {
            self.makePopup(e.data);
          });
        this.listeners["closePopup"] =
          eventManager.addEventListener("closePopup", function(e)
          {
            self.closePopup(e.data);
          });
      },

      componentWillUnmount: function()
      {
        for (var listenerId in this.listeners)
        {
          eventManager.removeEventListener(listenerId, this.listeners[listenerId]);
        }
      },

      getInitialState: function()
      {
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

      closePopup: function(id: number)
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
        var popups = this.state.popups.concat(
        {
          content: props.content,
          id: this.getPopupId()
        });

        this.setState(
        {
          popups: popups
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
              closePopup: this.closePopup
            })
          );
        }

        return(
          React.DOM.div(
          {
            className: "popup-container"
          },
            toRender
          )
        );
      }
    });
  }
}