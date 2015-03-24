/// <reference path="flagpicker.ts" />
/// <reference path="../mixins/focustimer.ts" />
module Rance
{
  export module UIComponents
  {
    export var FlagSetter = React.createClass(
    {
      displayName: "FlagSetter",
      mixins: [FocusTimer],
      getInitialState: function()
      {
        var flag = new Flag(
        {
          width: 46, // FLAG_SIZE
          mainColor: this.props.mainColor,
          subColor: this.props.subColor,
          tetriaryColor: this.props.tetriaryColor
        });

        flag.generateRandom();

        return(
        {
          flag: flag,
          icon: flag.draw().toDataURL(),
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
      displayImageLoadingFailMessage: function(error)
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
      handleClick: function(e)
      {
        var focusGraceTime = 500;
        console.log(Date.now() - this.lastFocusTime);
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
        var emblem = new Emblem(undefined, 1, emblemTemplate);
        this.state.flag.setForegroundEmblem(emblem);
        this.handleUpdate();
      },

      stopEvent: function(e)
      {
        e.stopPropagation();
        e.preventDefault();
      },

      handleDrop: function(e)
      {
        if (e.dataTransfer)
        {
          this.stopEvent(e);

          var files = e.dataTransfer.files;

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
              var getImageDataUrl = function(image)
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
              img.onload = function(e)
              {
                this.state.flag.setCustomImage(getImageDataUrl(img));
                this.handleUpdate();
              }.bind(this)
              img.onerror = function(e)
              {
                this.displayImageLoadingFailMessage(e);
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

      handleUpload: function(files: any[])
      {
        var image = this.getFirstValidImageFromFiles(files);
        if (!image) return false;

        this.setCustomImageFromFile(image);
        return true;
      },

      getFirstValidImageFromFiles: function(files: any[])
      {
        var image;

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

      setCustomImageFromFile: function(file)
      {
        var reader = new FileReader();

        reader.onloadend = function()
        {
          this.state.flag.setCustomImage(reader.result);
          this.handleUpdate();
        }.bind(this);

        reader.readAsDataURL(file);
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
        this.handleUpdate();
      },

      handleUpdate: function()
      {
        this.clearImageLoadingFailMessage();
        this.setState(
        {
          icon: this.state.flag.draw().toDataURL()
        });
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
            React.DOM.img(
            {
              className: "flag-setter-display",
              src: this.state.icon,
              onClick: this.toggleActive
            }),
            this.props.isActive || this.state.isActive ?
              UIComponents.FlagPicker(
              {
                flag: this.state.flag,
                handleSelectEmblem: this.setForegroundEmblem,
                hasImageFailMessage: this.state.hasImageFailMessage,
                onChange: this.handleUpdate,
                uploadFiles: this.handleUpload
              }) : null
          )
        );
      }
    })
  }
}
