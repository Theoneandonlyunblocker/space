/// <reference path="../../../lib/react-global-0.13.3.d.ts" />

import
{
  default as Popup,
  PopupComponent,
  CustomPopupProps,
  PropTypes as PopupProps,
  InitialPositionRect
} from "./Popup";
import eventManager from "../../eventManager";
import {extendObject} from "../../utility";


interface MakePopupFunctionProps
{
  contentConstructor: React.Factory<any>;
  contentProps: any;
  popupProps?: CustomPopupProps;
}

interface PropTypes extends React.Props<any>
{
  onlyAllowOne?: boolean;
}

interface StateType
{
  popups?: PopupProps[];
}

export class PopupManagerComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "PopupManager";
  state: StateType;
  
  popupId: number = 0;
  currentZIndex: number = 0;
  
  popupComponentsByID:
  {
    [id: number]: PopupComponent;
  } = {};
  listeners:
  {
    [key: string]: Function;
  } = {};

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.getHighestZIndexPopup = this.getHighestZIndexPopup.bind(this);
    this.incrementZIndex = this.incrementZIndex.bind(this);
    this.getInitialPosition = this.getInitialPosition.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.makePopup = this.makePopup.bind(this);
    this.setPopupContent = this.setPopupContent.bind(this);
    this.getPopupId = this.getPopupId.bind(this);
    this.hasPopup = this.hasPopup.bind(this);
    this.getPopup = this.getPopup.bind(this);    
  }
  
  componentWillMount()
  {
    var self = this;
    this.listeners["makePopup"] =
      eventManager.addEventListener("makePopup", function(data: MakePopupFunctionProps)
      {
        self.makePopup(data);
      });
    this.listeners["closePopup"] =
      eventManager.addEventListener("closePopup", function(popupId: number)
      {
        self.closePopup(popupId);
      });
    this.listeners["setPopupContent"] =
      eventManager.addEventListener("setPopupContent", function(data: {id: number; content: any;})
      {
        self.setPopupContent(data.id, data.content);
      });
  }

  componentWillUnmount()
  {
    for (let listenerId in this.listeners)
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
    var popups: PopupComponent[] = [];
    for (let id in this.popupComponentsByID)
    {
      popups.push(this.popupComponentsByID[id]);
    }
    return popups.sort(function(a: PopupComponent, b: PopupComponent)
    {
      return b.state.zIndex - a.state.zIndex;
    })[0];
  }

  getInitialPosition(rect: InitialPositionRect, container: HTMLElement)
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
      var topMostPopupPosition = this.getHighestZIndexPopup().dragPositioner.dragPos;
      return(
      {
        left: topMostPopupPosition.x + 20,
        top: topMostPopupPosition.y + 20
      });
    }
  }

  incrementZIndex(childZIndex: number)
  {
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
    for (let i = 0; i < this.state.popups.length; i++)
    {
      if (this.state.popups[i].id === id) return this.state.popups[i];
    }

    return null;
  }

  hasPopup(id: number)
  {
    for (let i = 0; i < this.state.popups.length; i++)
    {
      if (this.state.popups[i].id === id) return true;
    }

    return false;
  }

  closePopup(id: number)
  {
    if (!this.hasPopup(id)) throw new Error("No such popup");

    var newPopups: PopupProps[] = [];

    for (let i = 0; i < this.state.popups.length; i++)
    {
      if (this.state.popups[i].id !== id)
      {
        newPopups.push(this.state.popups[i]);
      }
    }

    this.setState({popups: newPopups});
  }

  makePopup(props: MakePopupFunctionProps)
  {
    var id = this.getPopupId();

    var popupProps: PopupProps = props.popupProps ? extendObject(props.popupProps) : {};

    popupProps.contentConstructor = props.contentConstructor;
    popupProps.contentProps = props.contentProps;
    popupProps.id = id;
    popupProps.key = id;
    popupProps.ref = (component: PopupComponent) =>
    {
      this.popupComponentsByID[id] = component;
    }
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

    for (let i = 0; i < popups.length; i++)
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

const Factory: React.Factory<PropTypes> = React.createFactory(PopupManagerComponent);
export default Factory;
