/// <reference path="../../../lib/react-global.d.ts" />


import SubEmblemTemplate from "../../templateinterfaces/SubEmblemTemplate";

import Flag from "../../Flag";
import app from "../../App"; // TODO global

export interface PropTypes extends React.Props<any>
{
  handleSelectEmblem: (selectedEmblemTemplate: SubEmblemTemplate) => void;
  uploadFiles: (files: FileList) => void;
  flag: Flag;
  failMessage: React.ReactElement<any>;
}

interface StateType
{
  selectedEmblem?: SubEmblemTemplate;
}

export class FlagPickerComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "FlagPicker";
  state: StateType;
  ref_TODO_imageUploader: HTMLInputElement;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialStateTODO();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.clearSelectedEmblem = this.clearSelectedEmblem.bind(this);
    this.handleSelectEmblem = this.handleSelectEmblem.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.makeEmblemElement = this.makeEmblemElement.bind(this);    
  }
  
  private getInitialStateTODO(): StateType
  {
    var initialEmblem: SubEmblemTemplate = null;
    if (this.props.flag.foregroundEmblem)
    {
      initialEmblem = this.props.flag.foregroundEmblem.inner;
    }
    return(
    {
      selectedEmblem: initialEmblem
    });
  }

  handleSelectEmblem(emblemTemplate: SubEmblemTemplate)
  {
    if (this.state.selectedEmblem === emblemTemplate && emblemTemplate !== null)
    {
      this.clearSelectedEmblem();
      return;
    }
    ReactDOM.findDOMNode<HTMLInputElement>(this.ref_TODO_imageUploader).value = null;
    this.props.handleSelectEmblem(emblemTemplate);
    this.setState({selectedEmblem: emblemTemplate});
  }

  clearSelectedEmblem()
  {
    this.handleSelectEmblem(null);
  }

  handleUpload()
  {
    var files = ReactDOM.findDOMNode<HTMLInputElement>(this.ref_TODO_imageUploader).files;

    const uploadSuccessful = this.props.uploadFiles(files);
    if (!uploadSuccessful)
    {
      this.ref_TODO_imageUploader.value = "";
    }
  }
  makeEmblemElement(template: SubEmblemTemplate)
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
  }

  render()
  {
    var emblemElements: React.ReactHTMLElement<any>[] = [];

    for (let emblemType in app.moduleData.Templates.SubEmblems)
    {
      var template = app.moduleData.Templates.SubEmblems[emblemType];
      emblemElements.push(this.makeEmblemElement(template));
    }

    var imageInfoMessage: React.ReactElement<any>;
    if (this.props.failMessage)
    {
      imageInfoMessage = this.props.failMessage;
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
              accept: "image/*",
              ref: (component: HTMLInputElement) =>
              {
                this.ref_TODO_imageUploader = component;
              },
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
            emblemElements
          )
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(FlagPickerComponent);
export default Factory;
