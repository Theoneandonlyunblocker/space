/// <reference path="../mixins/focustimer.ts" />
/// <reference path="../playerflag.ts" />

/// <reference path="flagpicker.ts" />
export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class FlagSetter extends React.Component<PropTypes, Empty>
{
  displayName: "FlagSetter",
  mixins: [FocusTimer],
  getInitialState: function()
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
      hasImageFailMessage: false,
      active: false
    });
  },
  componentWillUnmount: function()
  {
    window.clearTimeout(this.imageLoadingFailTimeout);
    document.removeEventListener("click", this.handleClick);
    this.clearFocusTimerListener();
  },
  displayImageLoadingFailMessage: function()
  {
    this.setState({hasImageFailMessage: true});

    this.imageLoadingFailTimeout = window.setTimeout(function()
    {
      this.setState({hasImageFailMessage: false});
    }.bind(this), 10000);
  },
  clearImageLoadingFailMessage: function()
  {
    if (this.imageLoadingFailTimeout)
    {
      window.clearTimeout(this.imageLoadingFailTimeout);
    }
    this.setState({hasImageFailMessage: false});
  },
  handleClick: function(e: MouseEvent)
  {
    var focusGraceTime = 500;
    if (Date.now() - this.lastFocusTime <= focusGraceTime) return;

    var node = this.refs.main.getDOMNode();
    if (e.target === node || node.contains(e.target))
    {
      return;
    }
    else
    {
      this.setAsInactive();
    }
  },

  toggleActive: function()
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
      this.registerFocusTimerListener();
    }
  },
  setAsInactive: function()
  {
    if (this.isMounted() && this.state.isActive)
    {
      this.setState({isActive: false});
      document.removeEventListener("click", this.handleClick);
      this.clearFocusTimerListener();
    }
  },

  setForegroundEmblem: function(emblemTemplate: Templates.ISubEmblemTemplate)
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
  },

  stopEvent: function(e: Event)
  {
    e.stopPropagation();
    e.preventDefault();
  },

  handleDrop: function(e: DragEvent)
  {
    if (e.dataTransfer)
    {
      this.stopEvent(e);

      var files: FileList = e.dataTransfer.files;

      var image = this.getFirstValidImageFromFiles(files);

      if (!image)
      {
        // try to get image from any html img element dropped
        var htmlContent = e.dataTransfer.getData("text\/html");
        var imageSource = htmlContent.match(/src\s*=\s*"(.+?)"/)[1];

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
  },

  handleUpload: function(files: FileList)
  {
    var image = this.getFirstValidImageFromFiles(files);
    if (!image) return false;

    this.setCustomImageFromFile(image);
    return true;
  },

  getFirstValidImageFromFiles: function(files: FileList)
  {
    var image: File;

    for (var i = 0; i < files.length; i++)
    {
      var file = files[i];
      if (file.type.indexOf("image") !== -1)
      {
        image = file;
        break;
      }
    }

    return image;
  },

  setCustomImageFromFile: function(file: File)
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
  },

  componentWillReceiveProps: function(newProps: any)
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
  },

  handleUpdate: function(dontTriggerParentUpdates?: boolean)
  {
    this.clearImageLoadingFailMessage();

    if (this.state.flag.customImage)
    {
      if (this.refs.flagPicker)
      {
        this.refs.flagPicker.clearSelectedEmblem();
      }
    }

    if (!dontTriggerParentUpdates)
    {
      this.props.toggleCustomImage(this.state.flag.customImage);
    }

    this.forceUpdate();
  },

  render: function()
  {
    return(
      React.DOM.div(
      {
        className: "flag-setter",
        ref: "main",
        onDragEnter: this.stopEvent,
        onDragOver: this.stopEvent,
        onDrop: this.handleDrop
      },
        UIComponents.PlayerFlag(
        {
          flag: this.state.flag,
          isMutable: true,
          props:
          {
            className: "flag-setter-display",
            onClick: this.toggleActive
          }
        }),
        this.props.isActive || this.state.isActive ?
          UIComponents.FlagPicker(
          {
            ref: "flagPicker",
            flag: this.state.flag,
            handleSelectEmblem: this.setForegroundEmblem,
            hasImageFailMessage: this.state.hasImageFailMessage,
            onChange: this.handleUpdate,
            uploadFiles: this.handleUpload
          }) : null
      )
    );
  }
}
