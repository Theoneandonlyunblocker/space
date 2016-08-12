/// <reference path="../../../lib/react-global.d.ts" />


import {default as FlagPicker, FlagPickerComponent} from "./FlagPicker";
import PlayerFlag from "../PlayerFlag";
import Flag from "../../Flag";
import Color from "../../Color";
import Emblem from "../../Emblem";
import SubEmblemTemplate from "../../templateinterfaces/SubEmblemTemplate";

import applyMixins from "../mixins/applyMixins";

const failMessages =
{
  loading: React.DOM.div(
    {className: "image-info-message image-loading-fail-message"},
    "Linked image failed to load. Try saving it to your own computer " + 
    "and uploading it."
  )
}

export interface PropTypes extends React.Props<any>
{
  mainColor: Color;
  subColor: Color;
  tetriaryColor?: Color;
  setActiveColorPicker: (setterComponent: FlagSetterComponent) => void;
  toggleCustomImage: (image?: string) => void;
}

interface StateType
{
  flag?: Flag;
  isActive?: boolean;
  failMessage?: React.ReactElement<any>;
}

export class FlagSetterComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "FlagSetter";
  state: StateType;
  
  ref_TODO_flagPicker: FlagPickerComponent;
  ref_TODO_main: HTMLElement;
  
  failMessageTimeoutHandle: number;
  
  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialStateTODO();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.getFirstValidImageFromFiles = this.getFirstValidImageFromFiles.bind(this);
    this.displayImageLoadingFailMessage = this.displayImageLoadingFailMessage.bind(this);
    this.setAsInactive = this.setAsInactive.bind(this);
    this.setForegroundEmblem = this.setForegroundEmblem.bind(this);
    this.clearFailMessage = this.clearFailMessage.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.setCustomImageFromFile = this.setCustomImageFromFile.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.toggleActive = this.toggleActive.bind(this);
    this.stopEvent = this.stopEvent.bind(this);    
  }
  
  private getInitialStateTODO(): StateType
  {
    var flag = new Flag(
    {
      width: 46, // global FLAG_SIZE
      mainColor: this.props.mainColor,
      secondaryColor: this.props.subColor,
      tetriaryColor: this.props.tetriaryColor
    });

    return(
    {
      flag: flag,
      failMessage: null
    });
  }
  componentWillUnmount()
  {
    this.clearFailMessageTimeout();
    document.removeEventListener("click", this.handleClick);
  }
  clearFailMessageTimeout()
  {
    if (this.failMessageTimeoutHandle)
    {
      window.clearTimeout(this.failMessageTimeoutHandle);
    }
  }
  clearFailMessage()
  {
    this.clearFailMessageTimeout();

    this.setState({failMessage: null});
  }
  displayImageLoadingFailMessage()
  {
    this.setState(
    {
      failMessage: failMessages.loading
    });

    this.failMessageTimeoutHandle = window.setTimeout(() =>
    {
      this.clearFailMessage();
    }, 10000);
  }
  handleClick(e: MouseEvent)
  {
    var node = ReactDOM.findDOMNode<HTMLElement>(this.ref_TODO_main);
    const target = <HTMLElement> e.target;
    if (target === node || node.contains(target))
    {
      return;
    }
    else
    {
      this.setAsInactive();
    }
  }

  toggleActive()
  {
    if (this.state.isActive)
    {
      this.setAsInactive();
    }
    else
    {
      if (this.props.setActiveColorPicker)
      {
        this.props.setActiveColorPicker(this);
      }
      this.setState({isActive: true});
      document.addEventListener("click", this.handleClick, false);
    }
  }
  setAsInactive()
  {
    if (this.state.isActive)
    {
      this.setState({isActive: false});
      document.removeEventListener("click", this.handleClick);
    }
  }

  setForegroundEmblem(emblemTemplate: SubEmblemTemplate)
  {
    var shouldUpdate = emblemTemplate || this.state.flag.foregroundEmblem;

    var emblem: Emblem = null;
    if (emblemTemplate)
    {
      emblem = new Emblem(undefined, 1, emblemTemplate);
    }

    this.state.flag.setForegroundEmblem(emblem);

    if (shouldUpdate)
    {
      this.handleUpdate();
    }
  }

  stopEvent(e: React.DragEvent)
  {
    e.stopPropagation();
    e.preventDefault();
  }

  handleDrop(e: React.DragEvent)
  {
    if (e.dataTransfer)
    {
      this.stopEvent(e);

      var files: FileList = e.dataTransfer.files;

      var image = this.getFirstValidImageFromFiles(files);

      if (!image)
      {
        // try to get image from any html img element dropped
        var htmlContent = e.dataTransfer.getData("text/html");
        var imageSource = htmlContent ? htmlContent.match(/src\s*=\s*"(.+?)"/)[1] : null;

        if (!imageSource)
        {
          console.error("None of the files provided are valid images");
          return;
        }
        else
        {
          var getImageDataUrl = function(image: HTMLImageElement)
          {
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");

            canvas.width = image.width;
            canvas.height = image.height;

            ctx.drawImage(image, 0, 0);

            return canvas.toDataURL();
          };

          var img = new Image();
          img.crossOrigin = "Anonymous";
          img.onload = function(e: Event)
          {
            this.state.flag.setCustomImage(getImageDataUrl(img));
            this.handleUpdate();
          }.bind(this)
          img.onerror = function(e: Event)
          {
            this.displayImageLoadingFailMessage();
          }.bind(this);

          img.src = imageSource;

          // image was cached
          if (img.complete || img.complete === undefined)
          {
            this.state.flag.setCustomImage(getImageDataUrl(img));
            this.handleUpdate();
          }
          
        }
      }
      else
      {
        this.setCustomImageFromFile(image);
      }
    }
  }

  handleUpload(files: FileList)
  {
    var image = this.getFirstValidImageFromFiles(files);
    if (!image)
    {
      return false;
    }

    this.setCustomImageFromFile(image);
    return true;
  }

  getFirstValidImageFromFiles(files: FileList)
  {
    for (let i = 0; i < files.length; i++)
    {
      var file = files[i];
      console.log(file.type);
      if (file.type.indexOf("image") !== -1)
      {
        return file;
      }
    }

    return null;
  }

  setCustomImageFromFile(file: File)
  {
    var setImageFN = function(file: File)
    {
      var reader = new FileReader();

      reader.onloadend = function()
      {
        this.state.flag.setCustomImage(reader.result);
        this.handleUpdate();
      }.bind(this);

      reader.readAsDataURL(file);
    }.bind(this, file);

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

  componentWillReceiveProps(newProps: PropTypes)
  {
    var oldProps = this.props;

    this.state.flag.setColorScheme(
      newProps.mainColor,
      newProps.subColor,
      newProps.tetriaryColor
    );

    // if (!this.state.flag.customImage)
    // {
    //   this.handleUpdate();
    // }
    var colorHasUpdated: boolean;
    ["mainColor", "subColor", "tetriaryColor"].forEach(function(prop)
    {
      if (oldProps[prop] !== newProps[prop])
      {
        colorHasUpdated = true;
        return;
      }
    });

    if (colorHasUpdated)
    {
      this.handleUpdate(true);
      return;
    }
  }

  handleUpdate(dontTriggerParentUpdates?: boolean)
  {
    this.clearFailMessage();

    if (this.state.flag.customImage)
    {
      if (this.ref_TODO_flagPicker)
      {
        this.ref_TODO_flagPicker.clearSelectedEmblem();
      }
    }

    if (!dontTriggerParentUpdates)
    {
      this.props.toggleCustomImage(this.state.flag.customImage);
    }

    this.forceUpdate();
  }

  render()
  {
    return(
      React.DOM.div(
      {
        className: "flag-setter",
        ref: (component: HTMLElement) =>
        {
          this.ref_TODO_main = component;
        },
        onDragEnter: this.stopEvent,
        onDragOver: this.stopEvent,
        onDrop: this.handleDrop
      },
        PlayerFlag(
        {
          flag: this.state.flag,
          isMutable: true,
          props:
          {
            className: "flag-setter-display",
            onClick: this.toggleActive
          }
        }),
        this.state.isActive ?
          FlagPicker(
          {
            ref: (component: FlagPickerComponent) =>
            {
              this.ref_TODO_flagPicker = component;
            },
            flag: this.state.flag,
            handleSelectEmblem: this.setForegroundEmblem,
            failMessage: this.state.failMessage,
            // onChange: this.handleUpdate,
            uploadFiles: this.handleUpload
          }) : null
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(FlagSetterComponent);
export default Factory;
