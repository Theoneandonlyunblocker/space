/// <reference path="../popups/popupmanager.ts" />
/// <reference path="../popups/topmenupopup.ts" />

/// <reference path="../../tutorials/introtutorial.ts" />

/// <reference path="tutorial.ts" />

module Rance
{
  export module UIComponents
  {
    export var IntroTutorial = React.createClass(
    {
      displayName: "IntroTutorial",
      popupId: null,

      componentDidMount: function()
      {
        this.popupId = this.refs.popupManager.makePopup(
        {
          contentConstructor: UIComponents.TopMenuPopup,
          contentProps:
          {
            handleClose: this.closePopup,
            contentConstructor: UIComponents.Tutorial,
            contentProps:
            {
              pages: Rance.Tutorials.introTutorial.pages
            }
          },
          popupProps:
          {
            resizable: true,
            containerDragOnly: true
          }
        });
      },

      componentWillUnmount: function()
      {
        this.closePopup();
      },

      closePopup: function()
      {
        this.refs.popupManager.closePopup(this.popupId);
      },

      render: function()
      {
        return(
          UIComponents.PopupManager(
          {
            ref: "popupManager",
            onlyAllowOne: true
          })
        );
      }
    })
  }
}
