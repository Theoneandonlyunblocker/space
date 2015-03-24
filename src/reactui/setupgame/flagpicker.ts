module Rance
{
  export module UIComponents
  {
    export var FlagPicker = React.createClass(
    {
      displayName: "FlagPicker",
      getInitialState: function()
      {
        return(
        {
          selectedEmblem: null
        });
      },

      handleSelectEmblem: function(emblemTemplate: Templates.ISubEmblemTemplate)
      {
        this.props.handleSelectEmblem(emblemTemplate);
        this.setState({selectedEmblem: emblemTemplate});
      },

      render: function()
      {
        var emblems: any[] = [];

        for (var emblemType in Templates.SubEmblems)
        {
          var template = Templates.SubEmblems[emblemType];
          var className = "emblem-picker";
          if (this.state.selectedEmblem === template) className += " selected-emblem";
          emblems.push(React.DOM.img(
          {
            className: className,
            key: template.type,
            src: app.images["emblems"][template.imageSrc].src,
            onClick: this.handleSelectEmblem.bind(this, template)
          }));
        }

        var pirateTemplate =
        {
          type: "pirateEmblem",
          position: "both",
          foregroundOnly: true,
          imageSrc: "pirateEmblem.png"
        };

        var className = "emblem-picker";
        if (this.state.selectedEmblem === pirateTemplate) className += " selected-emblem";
        emblems.push(React.DOM.img(
        {
          className: className,
          key: pirateTemplate.type,
          src: app.images["emblems"][pirateTemplate.imageSrc].src,
          onClick: this.handleSelectEmblem.bind(this, pirateTemplate)
        }));

        var imageInfoMessage;
        if (this.props.hasImageFailMessage)
        {
          imageInfoMessage =
          React.DOM.span({className: "image-info-message image-loading-fail-message"},
            "Linked image failed to load. Try saving it to your own computer " + 
            "and uploading it."
          );
        }
        else
        {
          imageInfoMessage =
          React.DOM.span({className: "image-info-message"},
            "Click emblem or drag image here to set it as your flag"
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
              React.DOM.input(
              {
                className: "flag-image-upload-button",
                type: "file",
                ref: "imageUploader"
              }, imageInfoMessage)
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
