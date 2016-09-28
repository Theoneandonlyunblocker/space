/// <reference path="../../../lib/react-global.d.ts" />

import
{
  default as AutoPositioner,
  AutoPositionerProps
} from "../mixins/AutoPositioner";
import applyMixins from "../mixins/applyMixins";

import SubEmblemTemplate from "../../templateinterfaces/SubEmblemTemplate";

import Flag from "../../Flag";
import app from "../../App"; // TODO global

export interface PropTypes extends React.Props<any>
{
  handleSelectEmblem: (selectedEmblemTemplate: SubEmblemTemplate | null) => void;
  uploadFiles: (files: FileList) => void;
  flag: Flag;
  failMessage: React.ReactElement<any>;
  customImageFileName: string | null;

  autoPositionerProps?: AutoPositionerProps;
}

interface StateType
{
  selectedEmblem?: SubEmblemTemplate;
}

export class FlagPickerComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "FlagPicker";
  state: StateType;
  imageUploader: HTMLInputElement;

  constructor(props: PropTypes)
  {
    super(props);

    if (this.props.autoPositionerProps)
    {
      applyMixins(this, new AutoPositioner(this));
    }
    
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

  componentWillReceiveProps(newProps: PropTypes): void
  {
    if (this.props.customImageFileName && !newProps.customImageFileName)
    {
      this.clearImageUploader();
    }
  }

  handleSelectEmblem(emblemTemplate: SubEmblemTemplate | null)
  {
    if (emblemTemplate)
    {
      this.clearImageUploader();
    }
    
    if (this.state.selectedEmblem === emblemTemplate && emblemTemplate !== null)
    {
      this.clearSelectedEmblem();
      return;
    }

    this.props.handleSelectEmblem(emblemTemplate);
    this.setState({selectedEmblem: emblemTemplate});
  }

  clearSelectedEmblem()
  {
    this.handleSelectEmblem(null);
  }

  handleUpload(e: React.FormEvent)
  {
    const imageUploader = <HTMLInputElement> e.target;

    this.props.uploadFiles(imageUploader.files);
  }
  private clearImageUploader(): void
  {
    this.imageUploader.value = "";
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
      imageInfoMessage = React.DOM.div({className: "image-info-message"},
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
              onChange: this.handleUpload,
              ref: (element: HTMLInputElement) =>
              {
                this.imageUploader = element;
              }
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
