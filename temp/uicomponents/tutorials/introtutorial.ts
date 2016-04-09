/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../popups/popupmanager.ts" />
/// <reference path="../popups/topmenupopup.ts" />

/// <reference path="../../tutorials/introtutorial.ts" />

/// <reference path="tutorial.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

interface StateType
{
  // TODO refactor | add state type
}

class IntroTutorial extends React.Component<PropTypes, StateType>
{
  displayName: string = "IntroTutorial";
  popupId: reactTypeTODO_any = null;

  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  private getInitialState(): StateType
  {
    return(
    {
      show: TutorialState["introTutorial"] === tutorialStatus.show
    });
  }
  

  componentDidMount()
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
          pages: Tutorials.introTutorial.pages,
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
  }

  componentWillUnmount()
  {
    if (this.popupId)
    {
      this.closePopup();
    }
  }

  closePopup()
  {
    this.refs.popupManager.closePopup(this.popupId);
    this.popupId = null;
  }

  render()
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
