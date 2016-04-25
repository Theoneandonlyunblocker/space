/// <reference path="../../../lib/react-global.d.ts" />

import IntroTutorial from "../../tutorials/IntroTutorial";
import TutorialState from "../../tutorials/TutorialState";
import TutorialStatus from "../../tutorials/TutorialStatus";
import Tutorial from "./Tutorial";
import TopMenuPopup from "../popups/TopMenuPopup";
import {default as PopupManager, PopupManagerComponent} from "../popups/PopupManager";


export interface PropTypes extends React.Props<any>
{
}

interface StateType
{
  shouldShow?: boolean;
}

export class IntroTutorialComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "IntroTutorial";
  popupId: number = null;

  state: StateType;
  ref_TODO_popupManager: PopupManagerComponent;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialStateTODO();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.closePopup = this.closePopup.bind(this);
  }
  
  private getInitialStateTODO(): StateType
  {
    return(
    {
      shouldShow: TutorialStatus.introTutorial === TutorialState.show
    });
  }
  

  componentDidMount()
  {
    if (!this.state.shouldShow)
    {
      return;
    }

    this.popupId = this.ref_TODO_popupManager.makePopup(
    {
      content: TopMenuPopup(
      {
        handleClose: this.closePopup,
        content: Tutorial(
        {
          pages: IntroTutorial.pages,
          tutorialId: "introTutorial"
        })
      }),
      popupProps:
      {
        resizable: true,
        initialPosition:
        {
          width: 600,
          height: 350
        },
        minWidth: 300,
        minHeight: 250,
        dragPositionerProps:
        {
          containerDragOnly: true
        }
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
    if (!this.state.shouldShow)
    {
      return null;
    }
    
    return(
      PopupManager(
      {
        ref: (component: PopupManagerComponent) =>
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
