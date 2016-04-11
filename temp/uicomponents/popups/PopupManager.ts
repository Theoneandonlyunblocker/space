/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="popup.ts"/>
/// <reference path="confirmpopup.ts"/>


import Popup from "./Popup.ts";
import eventManager from "../../../src/eventManager.ts";


export interface PropTypes extends React.Props<any>
{
  onlyAllowOne?: boolean;
}

interface StateType
{
  popups?: any; // TODO refactor | define state type 456
}

class PopupManager_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "PopupManager";
  popupId: number = 0;


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
  
  componentWillMount()
  {
    this.listeners = {};
    var self = this;
    this.listeners["makePopup"] =
      eventManager.addEventListener("makePopup", function(data: any)
      {
        self.makePopup(data);
      });
    this.listeners["closePopup"] =
      eventManager.addEventListener("closePopup", function(popupId: number)
      {
        self.closePopup(popupId);
      });
    this.listeners["setPopupContent"] =
      eventManager.addEventListener("setPopupContent", function(data: any)
      {
        self.setPopupContent(data.id, data.content);
      });
  }

  componentWillUnmount()
  {
    for (var listenerId in this.listeners)
    {
      eventManager.removeEventListener(listenerId, this.listeners[listenerId]);
    }
  }

  private getInitialState(): StateType
  {
    return(
    {
      popups: []
    });
  }

  getHighestZIndexPopup()
  {
    if (this.state.popups.length === 0) return null;
    var popups: any = [];
    for (var ref in this.refs)
    {
      popups.push(this.refs[ref]);
    }
    return popups.sort(function(a: any, b: any)
    {
      return b.state.zIndex - a.state.zIndex;
    })[0];
  }

  getInitialPosition(rect: ClientRect, container: HTMLElement)
  {
    if (this.state.popups.length === 1)
    {
      return(
      {
        left: container.offsetWidth / 2.5 - rect.width / 2,
        top: container.offsetHeight / 2.5 - rect.height / 2
      });
    }
    else
    {
      var highestZPosition = this.getHighestZIndexPopup().dragPos;
      return(
      {
        left: highestZPosition.left + 20,
        top: highestZPosition.top + 20
      });
    }
  }

  incrementZIndex(childZIndex: number)
  {
    if (!this.currentZIndex) this.currentZIndex = 0;

    if (childZIndex === this.currentZIndex)
    {
      return this.currentZIndex;
    }
    else
    {
      return ++this.currentZIndex;
    }
  }

  getPopupId()
  {
    return this.popupId++;
  }

  getPopup(id: number)
  {
    for (var i = 0; i < this.state.popups.length; i++)
    {
      if (this.state.popups[i].id === id) return this.state.popups[i];
    }

    return null;
  }

  hasPopup(id: number)
  {
    for (var i = 0; i < this.state.popups.length; i++)
    {
      if (this.state.popups[i].id === id) return true;
    }

    return false;
  }

  closePopup(id: number)
  {
    if (!this.hasPopup(id)) throw new Error("No such popup");

    var newPopups:
    {
      contentConstructor: any;
      contentProps: any;
      id: number;
    }[] = [];

    for (var i = 0; i < this.state.popups.length; i++)
    {
      if (this.state.popups[i].id !== id)
      {
        newPopups.push(this.state.popups[i]);
      }
    }

    this.setState({popups: newPopups});
  }

  makePopup(props:
  {
    contentConstructor: any;
    contentProps: any;
    popupProps: any;
  })
  {
    var id = this.getPopupId();

    var popupProps = props.popupProps ? extendObject(props.popupProps) : {};

    popupProps.contentConstructor = props.contentConstructor;
    popupProps.contentProps = props.contentProps;
    popupProps.id = id;
    popupProps.key = id;
    popupProps.ref = id;
    popupProps.incrementZIndex = this.incrementZIndex;
    popupProps.closePopup = this.closePopup.bind(this, id);
    popupProps.getInitialPosition = this.getInitialPosition;

    if (this.props.onlyAllowOne)
    {
      this.setState(
      {
        popups: [popupProps]
      });
    }
    else
    {
      var popups = this.state.popups.concat(popupProps);

      this.setState(
      {
        popups: popups
      });
    }
    
    return id;
  }

  setPopupContent(popupId: number, newContent: any)
  {
    var popup = this.getPopup(popupId);
    if (!popup) throw new Error();

    popup.contentProps = extendObject(newContent, popup.contentProps);

    this.forceUpdate();
  }

  render()
  {
    var popups = this.state.popups;

    var toRender: React.ReactElement<any>[] = [];

    for (var i = 0; i < popups.length; i++)
    {
      var popup = popups[i];

      var popupProps = extendObject(popup);
      popupProps.activePopupsCount = popups.length;


      toRender.push(
        Popup(popupProps)
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
}

const Factory: React.Factory<PropTypes> = React.createFactory(PopupManager_COMPONENT_TODO);
export default Factory;
