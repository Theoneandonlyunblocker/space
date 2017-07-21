import * as React from "react";
import * as ReactDOM from "react-dom";

import Color from "../../Color";
import Emblem from "../../Emblem";
import {Flag} from "../../Flag";
import
{
  getFirstValidImageFromFiles,
  getHTMLImageElementFromDataTransfer,
} from "../../ImageFileProcessing";
import SubEmblemTemplate from "../../templateinterfaces/SubEmblemTemplate";
import {default as PlayerFlag, PlayerFlagComponent} from "../PlayerFlag";
import FlagEditor from "./FlagEditor";

import {default as DefaultWindow} from "../windows/DefaultWindow";

import {localize, localizeF} from "../../../localization/localize";


type FailMessageHandle =
  "hotLinkedImageLoadingFailed" |
  "noValidImageFile";

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
  public displayName: string = "FlagSetter";
  public state: StateType;

  private flagSetterContainer: HTMLElement;
  private playerFlagContainer: PlayerFlagComponent;

  private failMessageTimeoutHandle: number;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }

  public componentWillUnmount(): void
  {
    this.clearFailMessageTimeout();
    // document.removeEventListener("click", this.handleClick);
  }
  public render()
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
        onDrop: this.handleDrop,
      },
        PlayerFlag(
        {
          flag: this.props.flag,
          isMutable: true,
          props:
          {
            className: "flag-setter-display",
            onClick: this.toggleActive,
          },
          ref: (component: PlayerFlagComponent) =>
          {
            this.playerFlagContainer = component;
          },
        }),
        !this.state.isActive ? null :
        React.DOM.div(
        {
          className: "popup-container",
        },
          DefaultWindow(
          {
            title: localize("editFlag"),
            handleClose: this.setAsInactive,
            isResizable: false,
            getInitialPosition: (popupRect, containerRect) =>
            {
              const parentRect = this.getClientRect();

              return(
              {
                left: parentRect.right,
                top: parentRect.top - popupRect.height / 3,
                width: popupRect.width,
                height: popupRect.height,
              });
            },

            minWidth: 0,
            minHeight: 0,
          },
            FlagEditor(
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
            }),
          ),
        ),
      )
    );
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
  private makeFailMessage(messageHandle: FailMessageHandle, timeout: number): React.ReactElement<any>
  {
    return React.DOM.div(
    {
      className: "image-info-message image-loading-fail-message",
      style:
      {
        animationDuration: "" + timeout + "ms",
      },
    },
      localize(messageHandle),
    );
  }
  private clearFailMessageTimeout(): void
  {
    if (this.failMessageTimeoutHandle)
    {
      window.clearTimeout(this.failMessageTimeoutHandle);
    }
  }
  private clearFailMessage(): void
  {
    this.clearFailMessageTimeout();

    this.setState({failMessageElement: null});
  }
  private setFailMessage(messageHandle: FailMessageHandle, timeout: number): void
  {
    this.setState(
    {
      failMessageElement: this.makeFailMessage(messageHandle, timeout),
      customImageFile: null,
    });

    this.failMessageTimeoutHandle = window.setTimeout(() =>
    {
      this.clearFailMessage();
    }, timeout);
  }
  // private handleClick(e: MouseEvent): void
  // {
  //   const node = ReactDOM.findDOMNode<HTMLElement>(this.flagSetterContainer);
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
  private toggleActive(): void
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
  private setAsInactive(): void
  {
    if (this.state.isActive)
    {
      this.setState({isActive: false});
      // document.removeEventListener("click", this.handleClick);
    }
  }
  private setForegroundEmblem(emblemTemplate: SubEmblemTemplate | null, color: Color): void
  {
    let emblem: Emblem = null;
    if (emblemTemplate)
    {
      emblem = new Emblem([color], emblemTemplate, 1);
    }

    this.props.flag.addEmblem(emblem);
    this.handleSuccessfulUpdate();
  }
  private stopEvent(e: React.DragEvent<HTMLDivElement>): void
  {
    e.stopPropagation();
    e.preventDefault();
  }
  private handleDrop(e: React.DragEvent<HTMLDivElement>): void
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
      image =>
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
      errorType =>
      {
        switch (errorType)
        {
          case "noImage":
          {
            this.setFailMessage("noValidImageFile", 2000);
            break;
          }
          case "couldntLoad":
          {
            this.setFailMessage("hotLinkedImageLoadingFailed", 2000);
            break;
          }
        }
      });
    }
  }
  private handleUpload(files: FileList): void
  {
    const image = getFirstValidImageFromFiles(files);

    if (image)
    {
      this.setCustomImageFromFile(image);
    }
    else
    {
      this.setFailMessage("noValidImageFile", 2000);
    }
  }
  private setCustomImageFromFile(file: File): void
  {
    const setImageFN = () =>
    {
      const reader = new FileReader();

      reader.onloadend = () =>
      {
        this.props.flag.setCustomImage(reader.result);
        this.setState(
        {
          customImageFile: file,
        }, () =>
        {
          this.handleSuccessfulUpdate();
        });
      };

      reader.readAsDataURL(file);
    };

    const fileSizeInMegaBytes = file.size / 1024 / 1024;
    if (fileSizeInMegaBytes > 20)
    {
      const confirmMessage = localizeF("confirmUseLargeImage").format(
      {
        fileSize: fileSizeInMegaBytes.toFixed(2),
      });

      if (window.confirm(confirmMessage))
      {
        setImageFN();
      }
    }
    else
    {
      setImageFN();
    }
  }
  private handleSuccessfulUpdate(): void
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
  private getClientRect(): ClientRect
  {
    const ownNode = <HTMLElement> ReactDOM.findDOMNode<HTMLElement>(this.playerFlagContainer);
    return ownNode.getBoundingClientRect();
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(FlagSetterComponent);
export default Factory;
