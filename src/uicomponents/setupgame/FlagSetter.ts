/// <reference path="../../../lib/react-global.d.ts" />

import FlagEditor from "./FlagEditor";
import {default as PlayerFlag, PlayerFlagComponent} from "../PlayerFlag";
import Flag from "../../Flag";
import Color from "../../Color";
import Emblem from "../../Emblem";
import
{
  getFirstValidImageFromFiles,
  getHTMLImageElementFromDataTransfer
} from "../../ImageFileProcessing";
import SubEmblemTemplate from "../../templateinterfaces/SubEmblemTemplate";

import Popup from "../popups/Popup";
import TopMenuPopup from "../popups/TopMenuPopup";


interface FailMessage
{
  text: string;
}

const failMessages =
{
  hotlinkedImageLoadingFailed:
  {
    text: "Linked image failed to load. Try saving it to your own computer " + 
      "and uploading it."
  },
  noValidImageFile:
  {
    text: "The attached file wasn't recognized as an image."
  }
}

export interface PropTypes extends React.Props<any>
{
  flag: Flag;
  mainColor: Color;
  secondaryColor: Color;
  setAsActive: (setterComponent: FlagSetterComponent) => void;
  updateParentFlag: (flag: Flag) => void;
}

interface StateType
{
  isActive?: boolean;
  failMessageElement?: React.ReactElement<any> | null;
  customImageFile?: File | null;
}

export class FlagSetterComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "FlagSetter";
  state: StateType;
  
  flagSetterContainer: HTMLElement;
  playerFlagContainer: PlayerFlagComponent;
  
  failMessageTimeoutHandle: number;
  
  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialStateTODO();
    
    this.bindMethods();
  }
  private bindMethods(): void
  {
    this.setAsInactive = this.setAsInactive.bind(this);
    this.setForegroundEmblem = this.setForegroundEmblem.bind(this);
    this.setFailMessage = this.setFailMessage.bind(this);
    this.clearFailMessage = this.clearFailMessage.bind(this);
    this.setCustomImageFromFile = this.setCustomImageFromFile.bind(this);
    this.handleSuccessfulUpdate = this.handleSuccessfulUpdate.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.toggleActive = this.toggleActive.bind(this);
    this.stopEvent = this.stopEvent.bind(this);
    this.getClientRect = this.getClientRect.bind(this);
  }
  
  private getInitialStateTODO(): StateType
  {
    return(
    {
      isActive: false,
      failMessageElement: null,
      customImageFile: null,
    });
  }
  componentWillUnmount(): void
  {
    this.clearFailMessageTimeout();
    // document.removeEventListener("click", this.handleClick);
  }
  makeFailMessage(message: FailMessage, timeout: number): React.ReactElement<any>
  {
    return React.DOM.div(
    {
      className: "image-info-message image-loading-fail-message",
      style:
      {
        animationDuration: "" + timeout + "ms"
      }
    },
      message.text
    )
  }
  clearFailMessageTimeout(): void
  {
    if (this.failMessageTimeoutHandle)
    {
      window.clearTimeout(this.failMessageTimeoutHandle);
    }
  }
  clearFailMessage(): void
  {
    this.clearFailMessageTimeout();

    this.setState({failMessageElement: null});
  }
  setFailMessage(message: FailMessage, timeout: number): void
  {
    this.setState(
    {
      failMessageElement: this.makeFailMessage(message, timeout),
      customImageFile: null
    });

    this.failMessageTimeoutHandle = window.setTimeout(() =>
    {
      this.clearFailMessage();
    }, timeout);
  }
  // handleClick(e: MouseEvent): void
  // {
  //   var node = ReactDOM.findDOMNode<HTMLElement>(this.flagSetterContainer);
  //   const target = <HTMLElement> e.target;
  //   if (target === node || node.contains(target))
  //   {
  //     return;
  //   }
  //   else
  //   {
  //     e.stopPropagation();
  //     e.preventDefault();
  //     this.setAsInactive();
  //   }
  // }
  toggleActive(): void
  {
    if (this.state.isActive)
    {
      this.setAsInactive();
    }
    else
    {
      if (this.props.setAsActive)
      {
        this.props.setAsActive(this);
      }
      this.setState({isActive: true});
      // document.addEventListener("click", this.handleClick, false);
    }
  }
  setAsInactive(): void
  {
    if (this.state.isActive)
    {
      this.setState({isActive: false});
      // document.removeEventListener("click", this.handleClick);
    }
  }

  setForegroundEmblem(emblemTemplate: SubEmblemTemplate | null, color: Color): void
  {
    var emblem: Emblem = null;
    if (emblemTemplate)
    {
      emblem = new Emblem([color], emblemTemplate, 1);
    }

    this.props.flag.addEmblem(emblem);
    this.handleSuccessfulUpdate();
  }

  stopEvent(e: React.DragEvent): void
  {
    e.stopPropagation();
    e.preventDefault();
  }

  handleDrop(e: React.DragEvent): void
  {
    if (!e.dataTransfer)
    {
      return;
    }

    this.stopEvent(e);

    const files: FileList = e.dataTransfer.files;

    const imageFile = getFirstValidImageFromFiles(files);

    if (imageFile)
    {
      this.setCustomImageFromFile(imageFile);
    }
    else
    {
      getHTMLImageElementFromDataTransfer(e.dataTransfer,
      (image) =>
      {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = image.width;
        canvas.height = image.height;

        ctx.drawImage(image, 0, 0);

        const dataURL = canvas.toDataURL();

        this.props.flag.setCustomImage(dataURL);
        this.handleSuccessfulUpdate();
      },
      (errorType) =>
      {
        switch (errorType)
        {
          case "noImage":
          {
            this.setFailMessage(failMessages.noValidImageFile, 2000);
            break;
          }
          case "couldntLoad":
          {
            this.setFailMessage(failMessages.hotlinkedImageLoadingFailed, 2000);
            break;
          }
        }
      });
    }
  }

  handleUpload(files: FileList): void
  {
    var image = getFirstValidImageFromFiles(files);

    if (image)
    {
      this.setCustomImageFromFile(image);
    }
    else
    {
      this.setFailMessage(failMessages.noValidImageFile, 2000);
    }
  }

  setCustomImageFromFile(file: File): void
  {
    var setImageFN = () =>
    {
      var reader = new FileReader();

      reader.onloadend = () =>
      {
        this.props.flag.setCustomImage(reader.result);
        this.setState(
        {
          customImageFile: file 
        }, () =>
        {
          this.handleSuccessfulUpdate();
        });
      };

      reader.readAsDataURL(file);
    }

    var fileSizeInMegaBytes = file.size / 1024 / 1024;
    if (fileSizeInMegaBytes > 20)
    {
      if (window.confirm(
        "Are you sure you want to load an image that is " +
        fileSizeInMegaBytes.toFixed(2) + "MB in size?\n"+
        "(The image won't be stored online, " +
        "but processing it might take a while)"
      ))
      {
        setImageFN();
      }
    }
    else
    {
      setImageFN();
    }
  }

  handleSuccessfulUpdate(): void
  {
    if (this.state.failMessageElement)
    {
      this.clearFailMessage();
    }
    else
    {
      this.forceUpdate();
    }
  }

  getClientRect(): ClientRect
  {
    const ownNode = <HTMLElement> ReactDOM.findDOMNode<HTMLElement>(this.playerFlagContainer);
    return ownNode.getBoundingClientRect();
  }

  render()
  {
    return(
      React.DOM.div(
      {
        className: "flag-setter",
        ref: (component: HTMLElement) =>
        {
          this.flagSetterContainer = component;
        },
        onDragEnter: this.stopEvent,
        onDragOver: this.stopEvent,
        onDrop: this.handleDrop
      },
        PlayerFlag(
        {
          flag: this.props.flag,
          isMutable: true,
          props:
          {
            className: "flag-setter-display",
            onClick: this.toggleActive
          },
          ref: (component: PlayerFlagComponent) =>
          {
            this.playerFlagContainer = component;
          },
        }),
        !this.state.isActive ? null :
        React.DOM.div(
        {
          className: "popup-container"
        },
          Popup(
          {
            dragPositionerProps:
            {
              preventAutoResize: true,
              containerDragOnly: true,
            },
            id: 0,
            incrementZIndex: () => 0,
            closePopup: this.setAsInactive,
            getInitialPosition: () =>
            {
              return {left: 0, top: 0};
            },

            content: TopMenuPopup(
            {
              handleClose: this.setAsInactive,

              content: FlagEditor(
              {
                parentFlag: this.props.flag,
                backgroundColor: this.props.mainColor,
                playerSecondaryColor: this.props.secondaryColor,

                updateParentFlag: this.props.updateParentFlag,

                // handleSelectEmblem: this.setForegroundEmblem,
                // uploadFiles: this.handleUpload,
                // failMessage: this.state.failMessageElement,
                // customImageFileName: this.state.customImageFile ? this.state.customImageFile.name : null,
                // triggerParentUpdate: this.handleSuccessfulUpdate,

                
                // autoPositionerProps:
                // {
                //   getParentClientRect: this.getClientRect,
                //   positionOnUpdate: true,
                //   xSide: "outerRight",
                //   ySide: "innerTop",
                //   positionOnResize: true
                // }
              })
            }),
          })
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(FlagSetterComponent);
export default Factory;
