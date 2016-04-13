/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../popups/popupmanager.ts" />
/// <reference path="../popups/topmenupopup.ts" />

/// <reference path="../../tutorials/introtutorial.ts" />

/// <reference path="tutorial.ts" />


import IntroTutorial from "../../tutorials/IntroTutorial.ts";
import Tutorial from "./Tutorial.ts";
import TopMenuPopup from "../popups/TopMenuPopup.ts";
import PopupManager from "../popups/PopupManager.ts";


interface PropTypes extends React.Props<any>
{
}

interface StateType
{
  show?: any; // TODO refactor | define state type 456
}

interface RefTypes extends React.Refs
{
  popupManager: React.Component<any, any>; // TODO refactor | correct ref type 542 | PopupManager
}

export class IntroTutorialComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "IntroTutorial";
  popupId: reactTypeTODO_any = null;

  state: StateType;
  refsTODO: RefTypes;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.closePopup = this.closePopup.bind(this);    
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

    this.popupId = this.ref_TODO_popupManager.makePopup(
    {
      contentConstructor: TopMenuPopup,
      contentProps:
      {
        handleClose: this.closePopup,
        contentConstructor: Tutorial,
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
    this.ref_TODO_popupManager.closePopup(this.popupId);
    this.popupId = null;
  }

  render()
  {
    if (!this.state.show)
    {
      return null;
    }
    
    return(
      PopupManager(
      {
        ref: (component: TODO_TYPE) =>
{
  this.ref_TODO_popupManager = component;
},
        onlyAllowOne: true
      })
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(IntroTutorialComponent);
export default Factory;
