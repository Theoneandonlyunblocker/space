/// <reference path="../popups/popupmanager.ts" />
/// <reference path="../popups/topmenupopup.ts" />

/// <reference path="../../tutorials/introtutorial.ts" />

/// <reference path="tutorial.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class IntroTutorial extends React.Component<PropTypes, Empty>
{
  displayName: "IntroTutorial",
  popupId: null,

  getInitialState: function()
  {
    return(
    {
      show: Rance.TutorialState["introTutorial"] === tutorialStatus.show
    });
  },
  

  componentDidMount: function()
  {
    if (!this.state.show)
    {
      return;
    }

    this.popupId = this.refs.popupManager.makePopup(
    {
      contentConstructor: UIComponents.TopMenuPopup,
      contentProps:
      {
        handleClose: this.closePopup,
        contentConstructor: UIComponents.Tutorial,
        contentProps:
        {
          pages: Rance.Tutorials.introTutorial.pages,
          tutorialId: "introTutorial"
        }
      },
      popupProps:
      {
        resizable: true,
        containerDragOnly: true,
        initialPosition:
        {
          width: 600,
          height: 350
        },
        minWidth: 300,
        minHeight: 250
      }
    });
  },

  componentWillUnmount: function()
  {
    if (this.popupId)
    {
      this.closePopup();
    }
  },

  closePopup: function()
  {
    this.refs.popupManager.closePopup(this.popupId);
    this.popupId = null;
  },

  render: function()
  {
    if (!this.state.show)
    {
      return null;
    }
    
    return(
      UIComponents.PopupManager(
      {
        ref: "popupManager",
        onlyAllowOne: true
      })
    );
  }
}
