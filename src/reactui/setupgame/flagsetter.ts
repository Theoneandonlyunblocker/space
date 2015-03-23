/// <reference path="flagpicker.ts" />

module Rance
{
  export module UIComponents
  {
    export var FlagSetter = React.createClass(
    {
      displayName: "FlagSetter",
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
          active: false
        });
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
        }
      },
      setAsInactive: function()
      {
        if (this.isMounted() && this.state.isActive)
        {
          this.setState({isActive: false});
        }
      },

      stopEvent: function(e)
      {
        e.stopPropagation();
        e.preventDefault();
      },

      handleDrop: function(e)
      {
        if (e.dataTransfer && e.dataTransfer.files)
        {
          this.stopEvent(e);

          var image;
          var files = e.dataTransfer.files;

          for (var i = 0; i < files.length; i++)
          {
            var file = files[i];
            if (file.type.indexOf("image") !== -1)
            {
              image = file;
              break;
            }
          }

          if (!image) throw new Error("None of the files provided are valid images");

          var reader = new FileReader();

          reader.onloadend = function()
          {
            this.state.flag.setCustomImage(reader.result);
            this.handleUpdate();
          }.bind(this);

          reader.readAsDataURL(image);
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

        if (!this.state.flag.customImage)
        {
          this.handleUpdate();
        }
      },

      handleUpdate: function()
      {
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
                onChange: this.handleUpdate
              }) : null
          )
        );
      }
    })
  }
}
