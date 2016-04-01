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

export default class IntroTutorial extends React.Component<PropTypes, {}>
{
  displayName: string = "IntroTutorial";
  popupId: reactTypeTODO_any = null;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  getInitialState()
  {
    return(
    {
      show: Rance.TutorialState["introTutorial"] === tutorialStatus.show
    });
  }
  

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
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
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  componentWillUnmount()
  {
    if (this.popupId)
    {
      this.closePopup();
    }
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  closePopup()
  {
    this.refs.popupManager.closePopup(this.popupId);
    this.popupId = null;
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
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
