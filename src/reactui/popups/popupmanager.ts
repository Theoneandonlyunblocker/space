/// <reference path="popup.ts"/>

/// <reference path="tutorialpopup.ts"/>
/// <reference path="confirmpopup.ts"/>
module Rance
{
  export module UIComponents
  {
    export var PopupManager = React.createClass(
    {
      displayName: "PopupManager",

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
        this.listeners["setPopupContent"] =
          eventManager.addEventListener("setPopupContent", function(e)
          {
            self.setPopupContent(e.data.id, e.data.content);
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

      getPopup: function(id: number)
      {
        for (var i = 0; i < this.state.popups.length; i++)
        {
          if (this.state.popups[i].id === id) return this.state.popups[i];
        }

        return null;
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
        contentConstructor: any;
        contentProps: any;
      })
      {
        if (this.props.onlyAllowOne)
        {
          this.setState(
          {
            popups: [
            {
              contentConstructor: props.contentConstructor,
              contentProps: props.contentProps,
              id: this.getPopupId()
            }]
          });
        }
        else
        {
          var popups = this.state.popups.concat(
          {
            contentConstructor: props.contentConstructor,
            contentProps: props.contentProps,
            id: this.getPopupId()
          });

          this.setState(
          {
            popups: popups
          });
        }
        
      },

      setPopupContent: function(popupId: number, newContent: any)
      {
        var popup = this.getPopup(popupId);
        if (!popup) throw new Error();

        popup.contentProps = newContent;

        this.forceUpdate();
      },

      render: function()
      {
        var popups = this.state.popups;

        var toRender = [];

        for (var i = 0; i < popups.length; i++)
        {
          var popup = popups[i];

          toRender.push(
            UIComponents.Popup(
            {
              contentConstructor: popup.contentConstructor,
              contentProps: popup.contentProps,
              key: popup.id,
              incrementZIndex: this.incrementZIndex,
              closePopup: this.closePopup.bind(this, popup.id),
              activePopupsCount: this.state.popups.length
            })
          );
        }

        if (toRender.length < 1)
        {
          return null;
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