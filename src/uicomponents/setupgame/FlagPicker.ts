/// <reference path="../../../lib/react-global.d.ts" />

import EmblemPicker from "./EmblemPicker";
import
{
  default as AutoPositioner,
  AutoPositionerProps
} from "../mixins/AutoPositioner";
import applyMixins from "../mixins/applyMixins";

import SubEmblemTemplate from "../../templateinterfaces/SubEmblemTemplate";

import Color from "../../Color";
import Emblem from "../../Emblem";

export interface PropTypes extends React.Props<any>
{
  handleSelectEmblem: (selectedEmblemTemplate: SubEmblemTemplate | null) => void;
  uploadFiles: (files: FileList) => void;
  failMessage: React.ReactElement<any>;
  customImageFileName: string | null;

  foregroundEmblem: Emblem | null;
  mainColor: Color | null;
  secondaryColor: Color | null;
  

  autoPositionerProps?: AutoPositionerProps;
}

interface StateType
{
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
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentWillReceiveProps(newProps: PropTypes): void
  {
    if (this.props.customImageFileName && !newProps.customImageFileName)
    {
      this.clearImageUploader();
    }
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

  render()
  {
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
        EmblemPicker(
        {
          backgroundColor: this.props.mainColor,
          color: this.props.secondaryColor,
          emblem: this.props.foregroundEmblem ?
            this.props.foregroundEmblem.inner :
            null,

          setEmblem: this.props.handleSelectEmblem
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(FlagPickerComponent);
export default Factory;
