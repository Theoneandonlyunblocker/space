module Rance
{
  export module UIComponents
  {
    export var FlagPicker = React.createClass(
    {
      displayName: "FlagPicker",
      getInitialState: function()
      {
        var initialEmblem: Templates.ISubEmblemTemplate = null;
        if (this.props.flag.foregroundEmblem)
        {
          initialEmblem = this.props.flag.foregroundEmblem.inner;
        }
        return(
        {
          selectedEmblem: initialEmblem
        });
      },

      handleSelectEmblem: function(emblemTemplate: Templates.ISubEmblemTemplate)
      {
        if (this.state.selectedEmblem === emblemTemplate && emblemTemplate !== null)
        {
          this.clearSelectedEmblem();
          return;
        }
        this.refs.imageUploader.getDOMNode().value = null;
        this.props.handleSelectEmblem(emblemTemplate);
        this.setState({selectedEmblem: emblemTemplate});
      },

      clearSelectedEmblem: function()
      {
        this.handleSelectEmblem(null);
      },

      handleUpload: function()
      {
        if (!this.props.uploadFiles) throw new Error();

        var files = this.refs.imageUploader.getDOMNode().files;

        this.props.uploadFiles(files);
      },
      makeEmblemElement: function(template: Templates.ISubEmblemTemplate)
      {
        var className = "emblem-picker-image";
        if (this.state.selectedEmblem &&
          this.state.selectedEmblem.key === template.key)
        {
          className += " selected-emblem";
        }

        return(
          React.DOM.div(
          {
            className: "emblem-picker-container",
            key: template.key,
            onClick: this.handleSelectEmblem.bind(this, template)
          },
            React.DOM.img(
            {
              className: className,
              src: app.images[template.src].src
            })
          )
        );
      },

      render: function()
      {
        var emblems: any[] = [];

        for (var emblemType in app.moduleData.Templates.SubEmblems)
        {
          var template = app.moduleData.Templates.SubEmblems[emblemType];
          emblems.push(this.makeEmblemElement(template));
        }

        var imageInfoMessage: ReactDOMPlaceHolder;
        if (this.props.hasImageFailMessage)
        {
          imageInfoMessage =
          React.DOM.div({className: "image-info-message image-loading-fail-message"},
            "Linked image failed to load. Try saving it to your own computer " + 
            "and uploading it."
          );
        }
        else
        {
          imageInfoMessage =
          React.DOM.div({className: "image-info-message"},
            "Upload or drag image here to set it as your flag"
          );
        }
        

        return(
          React.DOM.div(
          {
            className: "flag-picker"
          },
            React.DOM.div(
            {
              className: "flag-image-uploader"
            },
              React.DOM.div({className: "flag-picker-title"},
                "Upload image"
              ),
              React.DOM.div(
              {
                className: "flag-image-uploader-content"
              },
                React.DOM.input(
                {
                  className: "flag-image-upload-button",
                  type: "file",
                  ref: "imageUploader",
                  onChange: this.handleUpload
                }),
                imageInfoMessage
              )
            ),
            React.DOM.div(
            {
              className: "emblem-picker"
            },
              React.DOM.div({className: "flag-picker-title"},
                "Emblems"
              ),
              React.DOM.div({className: "emblem-picker-emblem-list"},
                emblems
              )
            )
          )
        );
      }
    })
  }
}
